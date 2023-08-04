import { Injectable } from '@nestjs/common';
const moment = require('moment');

@Injectable()
export class StripeService {

    checkTrialDays(currentDate, trialDate) {
        const diff = +moment(currentDate, 'x').diff(moment(trialDate, 'x'), 'day');
        return diff >= 15;
    };
}
