import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Company} from "./companies.model";

@Module({
  providers: [CompaniesService],
  imports: [
    SequelizeModule.forFeature([Company]),
  ],
  exports: [CompaniesService]
})
export class CompaniesModule {}
