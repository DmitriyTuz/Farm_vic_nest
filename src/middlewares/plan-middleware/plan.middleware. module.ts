import {Module} from '@nestjs/common';
import {PlanMiddlewareService} from "./plan.middleware.service";
import {StripeModule} from "../../stripe/stripe.module";
import {CompaniesModule} from "../../companies/companies.module";
import {UsersModule} from "../../users/users.module";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../../users/users.model";
import {Company} from "../../companies/companies.model";

@Module({
    providers: [PlanMiddlewareService],
    imports: [
        SequelizeModule.forFeature([User, Company]),
        UsersModule,
        CompaniesModule,
        StripeModule
    ],
    exports: [PlanMiddlewareService]
})
export class PlanMiddlewareModule {}