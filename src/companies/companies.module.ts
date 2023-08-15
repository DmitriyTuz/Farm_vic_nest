import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Company} from "./companies.model";
import {HelpersModule} from "../lib/helpers/helpers.module";
import {CheckerModule} from "../lib/checker/checker.module";

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService],
  imports: [
    SequelizeModule.forFeature([Company]),
    HelpersModule,
    CheckerModule,
  ],
  exports: [CompaniesService]

})
export class CompaniesModule {}
