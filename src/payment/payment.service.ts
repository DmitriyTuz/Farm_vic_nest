import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Payment} from "./payment.model";

@Injectable()
export class PaymentService {

    constructor(@InjectModel(Payment) private paymentRepository: typeof Payment) {}

        async getOnePayment(userId) {
        return this.paymentRepository.findOne({ where: {userId} });
    }


}
