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

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
      SequelizeModule.forFeature([User, Tag, Company, UserTags, Payment]),
      HelpersModule,
      forwardRef(() => AuthModule)
  ],
  exports: [UsersService]
})
export class UsersModule {}
