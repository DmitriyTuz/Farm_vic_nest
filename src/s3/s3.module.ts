import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { S3Controller } from './s3.controller';
import { S3Service } from './s3.service';
import { AwsConfigModule } from '../aws.config/aws.config.module';

@Module({
    imports: [
        // MulterModule.register({
        //     dest: './uploads',
        // }),
        AwsConfigModule
    ],
    controllers: [S3Controller],
    providers: [S3Service],
    exports: [S3Service]
})
export class S3Module {}
