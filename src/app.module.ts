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
import { StripeModule } from './stripe/stripe.module';
import { CompaniesModule } from './companies/companies.module';
import { LocationsModule } from './locations/locations.module';
import { MapLocation } from "./locations/locations.model";
import {PlanMiddlewareModule} from "./middlewares/plan-middleware/plan.middleware. module";
import { TasksModule } from './tasks/tasks.module';
import {Task} from "./tasks/tasks.model";
import {UserTasks} from "./tasks/user-tasks.model";
import {TaskTags} from "./tasks/task-tags.model";
import {TaskLocations} from "./tasks/task-locations.model";
import { CompleteTaskModule } from './complete-task/complete-task.module';
import { ReportTaskModule } from './report-task/report-task.module';
import {CompleteTask} from "./complete-task/complete-task.model";
import {ReportTask} from "./report-task/report-task.model";
import { TwilioModule } from './lib/twilio/twilio.module';
import {Plan} from "./plans/plans.model";
import {AwsConfigModule} from "./aws.config/aws.config.module";
import {S3Module} from "./s3/s3.module";

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
            models: [User, Tag, Company, UserTags, Payment, MapLocation, Task, UserTasks, TaskTags, TaskLocations, CompleteTask, ReportTask, Plan],
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
        StripeModule,
        CompaniesModule,
        LocationsModule,
        PlanMiddlewareModule,
        TasksModule,
        CompleteTaskModule,
        ReportTaskModule,
        TwilioModule,
        AwsConfigModule,
        S3Module

    ]

})
export class AppModule {}