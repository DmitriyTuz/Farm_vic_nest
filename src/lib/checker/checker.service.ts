import { Injectable } from '@nestjs/common';

@Injectable()
export class CheckerService {

    checkRequiredFields(data: any, requiredFields: any[], isNull: boolean) {
        if (isNull) {
            for (let field in data) {
            // if (~requiredFields.indexOf(field) && !data[field]) {
                if (requiredFields.includes(field) && !data[field]) {
                    throw ({status: 422, message: `422-field-${field}-can't-be-null`, stack: new Error().stack});
                }
            }
        } else {
            if (requiredFields.length) {
                for (let field in data) {
                // if (~requiredFields.indexOf(field) && data[field]) {
                    if (requiredFields.includes(field) && data[field]) {
                        requiredFields.splice(requiredFields.indexOf(field), 1);
                    }
                }

                if (requiredFields.length) {
                    let words = (requiredFields.length > 1) ? '-fields' : '-field';
                    let message = `422-please-fill-in-the-required${words}`;

                    throw ({status: 422, message: message, args: requiredFields, stack: new Error().stack});
                }
            }
        }
    }

    checkUserPhone(phone) {
        if (!phone.match(/^\+[0-9]{9,15}$/gm)) {
            throw ({status: 422, message: `422-the-phone-number-is-not-correct-please-type-full-phone-number-with-country-code`, stack: new Error().stack});
        }
    }

    checkUserPassword(password) {
        if (password.length < 6) {
            throw ({status: 422, message: `422-password-must-be-at-least-6-characters`, stack: new Error().stack});
        }
    }

}
