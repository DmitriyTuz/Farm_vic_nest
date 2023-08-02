import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from './users/users.module';
import { ConfigModule } from "@nestjs/config";
import { User } from "./users/users.model";
import { Tag } from "./tags/tags.model";
import { Company } from "./companies/companies.model";
import { UserTags } from "./tags/user-tags.model";
import { AuthModule } from './auth/auth.module';
import { HelpersModule } from './lib/helpers/helpers.module';
import { CheckerModule } from './lib/checker/checker.module';
import { PasswordModule } from './lib/password/password.module';
import { AccountModule } from './account/account.module';
import { PaymentModule } from './payment/payment.module';
import { Payment } from "./payment/payment.model";
import { TagsModule } from './tags/tags.module';


@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: +process.env.POSTGRES_PORT,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User, Tag, Company, UserTags, Payment],
            // autoLoadModels: true
        }),
        UsersModule,
        AuthModule,
        HelpersModule,
        CheckerModule,
        PasswordModule,
        AccountModule,
        PaymentModule,
        TagsModule,
    ]

})
export class AppModule {}