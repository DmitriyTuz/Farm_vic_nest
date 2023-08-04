import { Injectable } from '@nestjs/common';
import {User} from "./users.model";
import {InjectModel} from "@nestjs/sequelize";
import {CreateUserDto} from "./dto/create-user.dto";
import {HelpersService} from "../lib/helpers/helpers.service";
import {Tag} from "../tags/tags.model";
import {Company} from "../companies/companies.model";
import _ from "underscore";
import { Op } from 'sequelize';
import {UserAttributes} from "../interfaces/user-attributes";

@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User,
                private helperService: HelpersService) {}

    async createUser(dto: CreateUserDto) {
        const user = await this.userRepository.create({...dto});
        return user;
    }

    async getAllUsers() {
        let users = await this.userRepository.findAll()
        // const usersAttributes = this.helperService.getModelFields(User, [], true, true, 'User')
        return users;
    }

    async getOneUser(findQuery): Promise<User> {
        return await User.findOne({
            attributes: this.helperService.getModelFields(User, [], true, true, 'User'),
            where: findQuery, include: [{
                attributes: ['id', 'name'],
                model: Tag,
                as: 'tags',
                through: {attributes: []}
            }, {
                model: Company, as: 'company'
            }]
        });
    }

    getUserData(user) {
        const data = _.pick(user, ['id', 'name', 'phone', 'type', 'tags', 'tasks', 'hasOnboard', 'companyId', 'company']);
        data.tags = data.tags.map(tag => tag.name);
        return data;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: { email },
            include: { all: true },
        });
        return user;
    }

    async getUserById(id) {
        return await this.userRepository.findOne({where: { id }});
    }

    async getAllWorkers(tagOptions, currentUserId) {
        try {
            const user = await this.getOneUser({id: currentUserId});

            let {search, ids} = tagOptions;
            const {companyId} = user;

            if (typeof ids === 'string' ) {
                ids = [ids];
            }

            const workers = await this.getWorkers({search, ids, companyId});

            const response = {
                success: true,
                data: {workers}
            };

            return response;
        } catch (err) {
            throw err;
        }
    }

    async getWorkers({ ids, search, companyId }) {
        const query: any = { attributes: ['id', 'name'], where: {}, limit: 10 };

        if (companyId) {
            query.where.companyId = companyId;
        }

        if (ids?.length) {
            query.where.id = { [Op.notIn]: ids };
        }

        if (search) {
            query.where[Op.or] = [{ name: { [Op.iLike]: `%${search}%` } }];
        }

        query.order = [['name', 'ASC']];

        const users = await this.userRepository.findAll(query);
        return users as UserAttributes[];
    }
}
