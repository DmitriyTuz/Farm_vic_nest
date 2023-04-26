import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./users.model";
import {HelpersModule} from "../lib/helpers/helpers.module";
import {Tag} from "../tags/tags.model";
import {Company} from "../companies/companies.model";
import {UserTags} from "../tags/user-tags.model";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
      SequelizeModule.forFeature([User, Tag, Company, UserTags]),
      HelpersModule
  ]
})
export class UsersModule {}
