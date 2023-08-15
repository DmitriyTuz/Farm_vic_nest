import { Injectable } from '@nestjs/common';
import {User} from "./users.model";
import {InjectModel} from "@nestjs/sequelize";
import {HelpersService} from "../lib/helpers/helpers.service";
import {Tag} from "../tags/tags.model";
import {Company} from "../companies/companies.model";
import _ from "underscore";
import { Op } from 'sequelize';
import {UserAttributes} from "../interfaces/user-attributes";
import {Task} from "../tasks/tasks.model";
import {CheckerService} from "../lib/checker/checker.service";
import {PasswordService} from "../lib/password/password.service";
import {TwilioService} from "../lib/twilio/twilio.service";
import {Payment} from "../payment/payment.model";
import {UserTypes} from "../lib/constants";
import {PaymentService} from "../payment/payment.service";

@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User,
                // @InjectModel(Payment) private paymentRepository: typeof Payment,
                private helperService: HelpersService,
                private checkerService: CheckerService,
                private passwordService: PasswordService,
                private twilioService: TwilioService,
                // private paymentService: PaymentService
    ) {}

    async create(currentUserId: number, req, res) {
        try {
            const admin = await this.getOneUser({id: currentUserId});
            const {companyId} = admin;

            const {tags} = req.body;
            req.body.companyId = companyId;

            const {user, message} = await this.createUser(req.body);
            await this.checkerService.checkTags(user, tags);

            const returnedUser = await this.getOneUser({id: user.id, companyId});

            let response = {
                success: true,
                notice: '200-user-has-been-created-successfully',
                data: {user: this.getUserData(returnedUser)}
            }

            response = this.checkerService.checkResponse(response, message);

            return res.status(200).send(response);
        } catch (err) {
            throw (err);
        }
    }

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

            return res.status(200).send({
                success: true,
                data: {users: returnedUsers, filterCounts}
            });

        } catch (err) {
            throw err;
        }
    }

    async getAllUsers(reqBody) {
        const query: any = {
            attributes: this.helperService.getModelFields(User, [], true, true, 'User'),
            where: {},
            // limit: 0,

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

        return this.userRepository.findAll(query);
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

    async createUser(userData) {
        try {
            const requiredFields = ['phone', 'name', 'type', 'companyId'];
            this.checkerService.checkRequiredFields(userData, requiredFields, false);
            const {phone, name, type} = userData;

            this.checkerService.checkUserPhone(phone);
            this.checkerService.checkName({name});
            this.checkerService.checkType(type, 'User');

            const createdFields = ['phone', 'name', 'type', 'password', 'companyId'];
            const newUser = this.helperService.getModelData(createdFields, userData);
            let newPass = userData.password;

            if (!userData.password) {
                newPass = this.passwordService.createPassword();
                newUser.password = newPass;
            }

            const user = await this.userRepository.create(newUser);

            const message = await this.twilioService.sendSMS(phone, newPass);
            // const message = await console.log('Hello !')

            return { user, message }
        } catch (err) {
            throw(err);
        }
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

    async update(req, res) {
        try {
            const {tags} = req.body;

            const user = await this.getOneUser({id: req.params.id});

            if (!user) {
                throw ({status: 404, message: '404-user-not-found', stack: new Error().stack});
            }

            await this.updateUser(user, req.body);
            await this.checkerService.checkTags(user, tags);

            const returnedUser = await this.getOneUser({id: req.params.id});

            return res.status(200).send({
                success: true,
                notice: '200-user-has-been-updated-successfully',
                data: {user: this.getUserData(returnedUser)}
            });
        } catch (err) {
            throw err;
        }
    }

    async updateUser(user, updateData) {
        const requiredFields = ['phone', 'newPassword'];
        this.checkerService.checkRequiredFields(updateData, requiredFields, true);

        const {newPassword, name, phone, type} = updateData;

        if (newPassword) {
            this.checkerService.checkUserPassword(newPassword);
            updateData.password = await this.passwordService.hashPassword(newPassword);
        }

        if (name) this.checkerService.checkName({name});
        if (phone) this.checkerService.checkUserPhone(phone);
        if (type) this.checkerService.checkType(type, 'User');

        const updatedFields = ['name', 'password', 'phone', 'type'];
        updateData = this.helperService.getModelData(updatedFields, updateData);

        return user.update(updateData);
    }

    // async remove(req, res) {
    //     try {
    //         const user = await this.getOneUser({id: req.params.id});
    //
    //         if (!user) {
    //             throw ({status: 404, message: '404-user-not-found', stack: new Error().stack});
    //         }
    //
    //         if (user.type === UserTypes.ADMIN && user.company.ownerId === user.id && user.company.isSubscribe) {
    //             const payment = await Payment.findOne({attributes: ['id', 'userId', 'subscriberId', 'customerId'], where: {userId: user.id}});
    //             if (payment) {
    //                 await this.paymentService.removeSubscribe(payment);
    //             }
    //         }
    //
    //         await this.removeUser(user);
    //
    //         return res.status(200).send({
    //             success: true,
    //             notice: '200-user-has-been-removed-successfully',
    //             userId: req.params.id
    //         });
    //     } catch (err) {
    //         throw err;
    //     }
    // }
    //
    // private async removeUser(user) {
    //     await user.destroy();
    // }
}
