import {forwardRef, Module} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./users.model";
import {HelpersModule} from "../lib/helpers/helpers.module";
import {Tag} from "../tags/tags.model";
import {Company} from "../companies/companies.model";
import {UserTags} from "../tags/user-tags.model";
import {AuthModule} from "../auth/auth.module";
import {Payment} from "../payment/payment.model";
import {StripeModule} from "../stripe/stripe.module";
import {CheckerModule} from "../lib/checker/checker.module";
import {PasswordModule} from "../lib/password/password.module";
import {TwilioModule} from "../lib/twilio/twilio.module";
import {PaymentModule} from "../payment/payment.module";
import {TagsModule} from "../tags/tags.module";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
      SequelizeModule.forFeature([User, Tag, Company]),
      HelpersModule,
      forwardRef(() => AuthModule),
      StripeModule,
      CheckerModule,
      PasswordModule,
      TwilioModule,
      forwardRef(() => PaymentModule),
      forwardRef(() => CheckerModule),
      forwardRef(() => TagsModule)
  ],
  exports: [UsersService]
})
export class UsersModule {}
