import {Module} from '@nestjs/common';
import {PlanMiddleware} from "./plan.middleware";
import {StripeModule} from "../../stripe/stripe.module";
import {CompaniesModule} from "../../companies/companies.module";

@Module({
    controllers: [],
    providers: [PlanMiddleware],
    imports: [
        UsersModule,
        CompaniesModule,
        StripeModule
    ],
    exports: [PlanMiddleware]
})
export class UsersModule {}