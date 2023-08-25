import { Injectable } from '@nestjs/common';
import { AwsConfigService } from '../aws.config/aws.config.service';
import { File } from 'multer';
import {DeleteObjectRequest} from "aws-sdk/clients/s3";

@Injectable()
export class S3Service {
    constructor(private awsConfigService: AwsConfigService) {}

    async uploadFileToS3(file: File, bucketName: string, key: string) {

        return new Promise((resolve, reject) => {
            const s3 = this.awsConfigService.getS3Instance();
            const params = {
                Bucket: bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            };

            s3.upload(params, function (err, data) {
                if (err) {
                    reject(err);
                }
                console.log(`File uploaded successfully. ${data.Location}`);
                resolve({
                    url: data.Location,
                    fileName: file.fileName,
                    type: file.mimetype,
                    thumbUrl: '',
                    size: file.size,
                    key
                });
            })
        })
    }

    async deleteFileFromS3(bucketName: string, key: string): Promise<void> {
        const s3 = this.awsConfigService.getS3Instance();
        const params: DeleteObjectRequest = {
            Bucket: bucketName,
            Key: key,
        };
        await s3.deleteObject(params).promise();
    }

}
