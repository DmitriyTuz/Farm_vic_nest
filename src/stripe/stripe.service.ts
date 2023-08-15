import { Injectable } from '@nestjs/common';
import Credentials from "../../credentials";
const moment = require('moment');
const stripe = require('stripe')(Credentials.config.STRIPE_SECRET_KEY);

@Injectable()
export class StripeService {

    checkTrialDays(currentDate, trialDate) {
        const diff = +moment(currentDate, 'x').diff(moment(trialDate, 'x'), 'day');
        return diff >= 15;
    };


    async createSubscribers(data, user) {
        // cus_Ja3GHQVWon6AFB, price_1Iwt9l285d61s2cI8Z2BSUCY
        const {customer, price} = data;
        const stripeQuery = {
            customer,
            items: [{price}],
        };

        return stripe.subscriptions.create(stripeQuery);
    }

    async cancelSubscribe(id) {
        return stripe.subscriptions.del(id);
    }
}
