import {Module} from '@nestjs/common';
import { TagsService } from './tags.service';
import {TagsController} from "./tags.controller";
import {SequelizeModule} from "@nestjs/sequelize";
import {Tag} from "./tags.model";
import {User} from "../users/users.model";
import {UserTags} from "./user-tags.model";
import {AuthModule} from "../auth/auth.module";
import {UsersModule} from "../users/users.module";
import {Company} from "../companies/companies.model";
import {CompaniesModule} from "../companies/companies.module";
import {StripeModule} from "../stripe/stripe.module";

@Module({
    controllers: [TagsController],
    providers: [TagsService],
    imports: [
        SequelizeModule.forFeature([Tag, User, UserTags, Company]),
        AuthModule,
        UsersModule,
        CompaniesModule,
        StripeModule
    ],
    exports: [TagsService]
})
export class TagsModule {}
