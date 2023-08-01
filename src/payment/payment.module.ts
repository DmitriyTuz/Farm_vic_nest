import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import {PaymentController} from "./payment.controller";
import {Payment} from "./payment.model";
import {User} from "../users/users.model";
import {SequelizeModule} from "@nestjs/sequelize";

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [SequelizeModule.forFeature([User, Payment]), PaymentModule],
  exports: [PaymentService]
})
export class PaymentModule {}
