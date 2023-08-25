import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsConfigService {
    private s3: AWS.S3;

    constructor(private configService: ConfigService) {

        const awsConfig = new AWS.Config({
            accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
            region: this.configService.get('eu-north-1')
        });

        this.s3 = new AWS.S3(awsConfig);
    }

    getS3Instance(): AWS.S3 {
        return this.s3;
    }
}
