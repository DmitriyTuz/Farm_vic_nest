import { Injectable } from '@nestjs/common';
import {LoginUserDto} from "./dto/login-user.dto";
import {HelpersService} from "../lib/helpers/helpers.service";
import {CheckerService} from "../lib/checker/checker.service";
import {PasswordService} from "../lib/password/password.service";
import {UsersService} from "../users/users.service";

import { Response } from 'express';

@Injectable()
export class AuthService {

    constructor(private helperService: HelpersService,
                private checkerService: CheckerService,
                private passwordService: PasswordService,
                private userService: UsersService,
                ) {}

    async signUp(reqBody, req, res) {
        // try {
        //     req.body.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        //
        //     const { logo, companyName, phone, name, password } = checkSignUpData(req.body);
        //     const { company } = await createCompany({ logo, name: companyName });
        //     const { user } = await createUser({ phone, name, type: UserTypes.ADMIN, password, companyId: company.id });
        //     await company.update({ownerId: user.id});
        //
        //     const response = {
        //         success: true
        //     }
        //
        //     return sendResponse({ id: user.id }, response, res);
        // } catch (err) {
        //     throw (err);
        // }
    }

    async login(reqBody, req, res) {
        try {
            reqBody.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

            const user = await this.webSiteAuthorization(reqBody);

            const response = {
                success: true
            }

            return this.helperService.sendResponse({id: user.id}, response, res);
        } catch (err) {
            console.log(err)
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

    async logout(req, res) {
        try {
            delete req.headers.authorization;
            res.clearCookie('AuthorizationToken');

            return res.status(200).send({success: true});
        } catch (err) {
            throw (err);
        }
    }

}
