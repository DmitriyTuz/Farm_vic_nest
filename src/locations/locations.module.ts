import { Module } from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {LocationsController} from "./locations.controller";
import {LocationsService} from "./locations.service";
import {MapLocation} from "./locations.model";
import {UsersModule} from "../users/users.module";
import {User} from "../users/users.model";
import {CompaniesModule} from "../companies/companies.module";
import {Company} from "../companies/companies.model";
import {StripeModule} from "../stripe/stripe.module";


@Module({
    controllers: [LocationsController],
    providers: [LocationsService],
    imports: [
        SequelizeModule.forFeature([MapLocation, User, Company]),
        UsersModule,
        CompaniesModule,
        StripeModule
    ],
    exports: [LocationsService]
})
export class LocationsModule {}
