import {Controller, Delete, Param, Post, Put, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { File } from 'multer';
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {Response} from "express";

@Controller()
export class S3Controller {
    constructor(private s3Service: S3Service) {}

    @Put('/api/upload/image')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFileToS3(@UploadedFile() file: File, @Res() res: Response) {
        const bucketName = process.env.AWS_BUCKET_NAME;
        const key = `${Date.now()}-${file.originalname}`;

        return res.json({
            success: true,
            urlData: await this.s3Service.uploadFileToS3(file, bucketName, key)
        })

        // return res.status(200).send({
        //     success: true,
        //     urlData: await this.s3Service.uploadFileToS3(file, bucketName, key)
        // })

    }

    @Delete('remove/:key')
    @ApiOperation({ summary: "Delete file from AWS S3" })
    @ApiResponse({ status: 200, description: 'deletion successful'})
    async deleteFileFromS3(@Param('key') key: string) {
        const bucketName = process.env.AWS_BUCKET_NAME;
        await this.s3Service.deleteFileFromS3(bucketName, key);
        return { message: 'File deleted successfully' };
    }

}
