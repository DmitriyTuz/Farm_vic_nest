import { Injectable } from '@nestjs/common';
import {HelpersService} from "../lib/helpers/helpers.service";
import {CheckerService} from "../lib/checker/checker.service";
import {PasswordService} from "../lib/password/password.service";
import {UsersService} from "../users/users.service";
import {UserTypes} from "../lib/constants";
import {CompaniesService} from "../companies/companies.service";

const jwt = require('jsonwebtoken');

import * as bcrypt from "bcryptjs";
import Credentials from "../../credentials";

@Injectable()
export class AuthService {

    constructor(private helperService: HelpersService,
                private checkerService: CheckerService,
                private passwordService: PasswordService,
                private userService: UsersService,
                private companyService: CompaniesService,
                ) {}

    async signUp(reqBody, req, res) {
        try {
            req.body.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

            const { logo, companyName, phone, name, password } = this.checkSignUpData(req.body);
            const { company } = await this.companyService.createCompany({ logo, name: companyName });
            const hashPassword = await bcrypt.hash(password, 5);

            console.log('password = ', password);
            console.log('hashPassword = ', hashPassword);

            const { user } = await this.userService.createUser({ phone, name, type: UserTypes.ADMIN, password: hashPassword, companyId: company.id });

            await company.update({ownerId: user.id});

            const response = {
                success: true
            }

            return this.helperService.sendResponse({ id: user.id }, response, res);
        } catch (err) {
            throw (err);
        }
    }

    async login(reqBody: any, req, res): Promise<any> {
        try {
            reqBody.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const user = await this.webSiteAuthorization(reqBody);

            const responseData = {
                success: true,
            };

            if (user?.id) {
                const token = jwt.sign({id: user.id}, process.env.JWT_SECRET);
                res.cookie('AuthorizationToken', token, { maxAge: Credentials.config.JWT_EXPIRED_TIME, httpOnly: true });
            }
            return res.json(responseData)

        } catch (err) {
            console.log(err)
        }
    }

    async logout(req, res) {
        try {
            delete req.headers.authorization;
            res.clearCookie('AuthorizationToken');

            return res.status(200).send({success: true});
        } catch (err) {
            throw (err);
        }
    }

    private async webSiteAuthorization(userData) {
        try {
            const requiredFields = ['phone', 'password'];
            this.checkerService.checkRequiredFields(userData, requiredFields, false);

            const {phone, password} = userData;
            this.checkerService.checkUserPhone(phone);

            let user = await this.userService.getOneUser({phone});

            if (!user) {
                throw ({status: 422, message: '422-incorrect-credentials', stack: new Error().stack});
            }

            user = await this.passwordService.checkPassword(user, userData);

            const valid = await this.passwordService.validPassword(password, user.password);

            if (!valid) {
                throw ({status: 422, message: '422-incorrect-credentials', stack: new Error().stack});
            }

            user = await user.update({lastActive: new Date()});

            return user;
        } catch (err) {
            throw (err);
        }
    }

    private checkSignUpData(data) {
        const requiredFields = ['companyName', 'phone', 'name', 'password'];
        this.checkerService.checkRequiredFields(data, requiredFields, false);
        return data;
    }

}
