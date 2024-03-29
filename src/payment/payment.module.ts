import {forwardRef, Module} from '@nestjs/common';
import { PaymentService } from './payment.service';
import {PaymentController} from "./payment.controller";
import {Payment} from "./payment.model";
import {User} from "../users/users.model";
import {SequelizeModule} from "@nestjs/sequelize";
import {Company} from "../companies/companies.model";
import {Plan} from "../plans/plans.model";
import {UsersModule} from "../users/users.module";
import {StripeModule} from "../stripe/stripe.module";
import {CheckerModule} from "../lib/checker/checker.module";

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [
      SequelizeModule.forFeature([Payment, Company, Plan, User]),
      forwardRef(() => UsersModule),
      StripeModule,
      CheckerModule
  ],
  exports: [PaymentService]
})
export class PaymentModule {}
