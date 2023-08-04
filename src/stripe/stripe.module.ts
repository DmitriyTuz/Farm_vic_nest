import {Module} from '@nestjs/common';
import { StripeService } from './stripe.service';
import {UsersModule} from "../users/users.module";


@Module({
  providers: [StripeService],
  imports: [
    UsersModule,
  ],
  exports: [StripeService]
})
export class StripeModule {}
