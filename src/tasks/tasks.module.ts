import { Module } from '@nestjs/common';
import {TasksController} from "./tasks.controller";
import {TasksService} from "./tasks.service";
import {UsersModule} from "../users/users.module";
import {HelpersModule} from "../lib/helpers/helpers.module";
import {Company} from "../companies/companies.model";
import {User} from "../users/users.model";
import {SequelizeModule} from "@nestjs/sequelize";
import {StripeModule} from "../stripe/stripe.module";
import {Task} from "./tasks.model";
import {CheckerModule} from "../lib/checker/checker.module";
import {TagsModule} from "../tags/tags.module";
import {LocationsModule} from "../locations/locations.module";

@Module({
    controllers: [TasksController],
    providers: [TasksService],

    imports: [
        SequelizeModule.forFeature([User, Company, Task]),
        UsersModule,
        HelpersModule,
        StripeModule,
        CheckerModule,
        TagsModule,
        LocationsModule
    ],

    exports: [TasksService]
})
export class TasksModule {}
