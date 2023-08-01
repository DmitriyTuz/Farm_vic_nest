import { Injectable } from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {PaymentService} from "../payment/payment.service";

@Injectable()
export class AccountService {

    constructor(private usersService: UsersService,
                private paymentService: PaymentService) {}

    async getOne(currentUserId) {
        try {

            console.log('currentUserId = ', currentUserId)
            const user = await this.usersService.getOneUser({id: currentUserId});

            if (!user) {
                throw ({status: 404, message: '404-user-not-found', stack: new Error().stack});
            }

            const payment = await this.paymentService.getOnePayment(user.id);

            const response = {
                success: true,
                data: {
                    user: this.usersService.getUserData(user),
                    payment,
                    company: user.company
                }
            };

            console.log('response = ', response)
            return response;
        } catch (err) {
            console.log(err);
        }
    }
}
