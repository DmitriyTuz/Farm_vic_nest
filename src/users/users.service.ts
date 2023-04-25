import { Injectable } from '@nestjs/common';
import {User} from "./users.model";
import {InjectModel} from "@nestjs/sequelize";
import {CreateUserDto} from "./dto/create-user.dto";
import {HelpersService} from "../lib/helpers/helpers.service";
import {Model} from "sequelize-typescript";


@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User,
                private helperService: HelpersService) {}

    // async createUser(dto: CreateUserDto) {
    //     const user = await this.userRepository.create(dto);
    //     return user;
    // }

    getAllUsers() {
        // let user = await this.userRepository.findOne({where: {id: 10000}})
        const usersAttributes = this.helperService.getModelFields(User, [], true, true, 'User')
        return usersAttributes;
    }
}
