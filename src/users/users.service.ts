import { Injectable } from '@nestjs/common';
import {User} from "./users.model";
import {InjectModel} from "@nestjs/sequelize";
import {CreateUserDto} from "./dto/create-user.dto";
import {HelpersService} from "../lib/helpers/helpers.service";
import {Tag} from "../tags/tags.model";
import {Company} from "../companies/companies.model";
import _ from "underscore";


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
}
