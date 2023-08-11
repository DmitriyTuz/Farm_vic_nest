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
import {Task} from "../tasks/tasks.model";

@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User,
                private helperService: HelpersService) {}

    async getAll(reqBody, currentUserId, req, res) {
        try {
            const user = await this.getOneUser({id: currentUserId});
            const {companyId} = user;

            const {search, type} = req.query;

            const users = await this.getAllUsers({search, type, companyId});
            const returnedUsers = [];
            for (const u of users) {
                returnedUsers.push(this.getUserData(u));
            }

            const filterCounts = await this.getFilterCount(companyId);

            const response = {
                success: true,
                data: {users: returnedUsers, filterCounts}
            };

            return response;
        } catch (err) {
            throw err;
        }
    }

    async getAllUsers(reqBody) {
        let query: any = {
            attributes: this.helperService.getModelFields(User, [], true, true, 'User'),
            where: {},
            limit: 0,

        };


        if (reqBody.companyId) {
            if (!reqBody.ids?.includes(10000)) {
                query.where.companyId = reqBody.companyId;
            }
        }

        if (reqBody.ids?.length) {
            query.where.id = {[Op.in]: reqBody.ids};
        }

        if (reqBody.type) {
            query.where.type = reqBody.type
        }

        if (reqBody.search) {
            query.where[Op.or] = [{name: {[Op.iLike]: `%${reqBody.search}%`}}]
            // query.where.name = {[Op.iLike]: `%${search}%`}
        }

        if (reqBody.limit) {
            query.limit = reqBody.limit;
        }

        query.include = [{
            attributes: ['id', 'name'],
            model: Tag,
            as: 'tags',
            through: {attributes: []},
            require: false,
        }, {
            attributes: this.helperService.getModelFields(Task, null, true, true, 'tasks'),
            model: Task,
            as: 'tasks',
            through: {attributes: []}
        }];

        // if (search) {
        //     query.include[0].where = {name: { [Op.iLike]: `%${search}%` }};
        // }

        query.order = [['id', 'ASC']]

        return User.findAll(query);
    }

    async getFilterCount(companyId) {
        const users = await this.getAllUsers({companyId});
        const groupUsers = _.groupBy(users, 'type');

        const filterCounts = {
            admins: 0,
            managers: 0,
            workers: 0,
            all: 0
        };

        for (const type in groupUsers) {
            filterCounts[`${type.toLowerCase()}s`] = groupUsers[type].length;
        }

        let all = 0

        for (const type in filterCounts) {
            all += filterCounts[type];
        }

        filterCounts.all = all;

        return filterCounts;
    }

    async createUser(dto: CreateUserDto) {
        const user = await this.userRepository.create({...dto});
        return user;
    }

    // async getAllUsers() {
    //     let users = await this.userRepository.findAll()
    //     // const usersAttributes = this.helperService.getModelFields(User, [], true, true, 'User')
    //     return users;
    // }

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
        const query: any = {
            attributes: ['id', 'name'],
            where: {}, limit: 10
        };

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

    async updateOnboardUser(currentUserId, res) {
        try {
            const user = await this.getOneUser({id: currentUserId});

            if (!user) {
                throw ({status: 404, message: '404-user-not-found', stack: new Error().stack});
            }

            await this.updateOnboard(user);

            return res.status(200).send({
                success: true,
                notice: '200-user-has-been-removed-successfully',
                userId: currentUserId
            });
        } catch (err) {
            throw err;
        }
    }

    async updateOnboard(user) {
        await this.userRepository.update({hasOnboard: true}, {where: {id: user.id}});
    }

}
