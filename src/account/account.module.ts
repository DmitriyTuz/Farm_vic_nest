import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import {PaymentModule} from "../payment/payment.module";
import {UsersModule} from "../users/users.module";
import {AccountController} from "./account.controller";

@Module({
  controllers: [AccountController],
  providers: [AccountService],
  imports: [UsersModule, PaymentModule],
  exports: [AccountService]
})
export class AccountModule {}
