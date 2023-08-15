import { Module } from '@nestjs/common';
import { CheckerService } from './checker.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Tag} from "../../tags/tags.model";


@Module({
  providers: [CheckerService],
  imports: [
    SequelizeModule.forFeature([Tag])
  ],
  exports: [CheckerService]
})
export class CheckerModule {}
