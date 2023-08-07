import { Module } from '@nestjs/common';
import {TasksController} from "./tasks.controller";
import {TasksService} from "./tasks.service";
import {UsersModule} from "../users/users.module";
import {HelpersModule} from "../lib/helpers/helpers.module";
import {Company} from "../companies/companies.model";
import {User} from "../users/users.model";
import {SequelizeModule} from "@nestjs/sequelize";
import {Tag} from "../tags/tags.model";
import {UserTags} from "../tags/user-tags.model";
import {StripeModule} from "../stripe/stripe.module";

@Module({
    controllers: [TasksController],
    providers: [TasksService],

    imports: [
        SequelizeModule.forFeature([User, Company]),
        UsersModule,
        HelpersModule,
        StripeModule
    ],

    exports: [TasksService]
})
export class TasksModule {}
