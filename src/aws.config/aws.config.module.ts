import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsConfigService } from './aws.config.service';

@Module({
  imports: [ConfigModule],
  providers: [AwsConfigService],
  exports: [AwsConfigService]
})
export class AwsConfigModule {}
