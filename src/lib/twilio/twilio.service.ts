import { Injectable } from '@nestjs/common';

@Injectable()
export class TwilioService {
    async sendSMS(phone, password) {
        try {
            const message = `Your password is -> ${password} <- `;

            // if (NODE_ENV === 'production') {
            //     await client.messages.create({
            //         body: message,
            //         from: TWILIO_NUMBER,
            //         to: phone
            //     });
            // }
            // else {
            console.log(`DEVELOPER MODE:`, message)
            // }

            return message;
        } catch (e) {
            throw (e)
        }
    }
}
