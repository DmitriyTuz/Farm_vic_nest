import {forwardRef, Module} from '@nestjs/common';
import { CheckerService } from './checker.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Tag} from "../../tags/tags.model";
import {UsersModule} from "../../users/users.module";
import {MapLocation} from "../../locations/locations.model";
import {PaymentModule} from "../../payment/payment.module";


@Module({
  providers: [CheckerService],
  imports: [
    SequelizeModule.forFeature([Tag, MapLocation]),
    forwardRef(() => UsersModule)
  ],
  exports: [CheckerService]
})
export class CheckerModule {}
