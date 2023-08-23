import { Injectable } from '@nestjs/common';
import {TaskTypes, UserTypes, TaskStatuses} from "../constants";
import {Tag} from "../../tags/tags.model";
import {InjectModel} from "@nestjs/sequelize";
import Credentials from '../../../credentials';
import {MapLocation} from "../../locations/locations.model";

@Injectable()
export class CheckerService {

    constructor(@InjectModel(Tag) private tagRepository: typeof Tag,
                @InjectModel(MapLocation) private locationRepository: typeof MapLocation) {}

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

    checkName(data) {
        for (let field in data) {
            if (['name', 'title',].includes(field) && (!data[field] || data[field].length < 2)) {
                throw ({status: 422, message: `422-${field}-must-be-at-least-2-characters`, stack: new Error().stack});
            }
        }
    }

    checkType(type, modelName) {
        if (modelName === 'User' && ![UserTypes.MANAGER, UserTypes.WORKER, UserTypes.ADMIN].includes(type)) {
            throw ({status: 422, message: `422-user-type-is-not-correct`, stack: new Error().stack});
        }

        if (modelName === 'Task' && ![TaskTypes.LOW, TaskTypes.MEDIUM, TaskTypes.HIGH].includes(type)) {
            throw ({status: 422, message: `422-task-type-is-not-correct`, stack: new Error().stack});
        }
    }

    checkResponse(response, message) {
        if (Credentials.config.NODE_ENV !== 'production') {
            response.smsMessage = message;
        }

        return response;
    }

    checkTaskStatus(status, action) {
        if (action === 'start' && status !== TaskStatuses.WAITING) {
            throw ({status: 422, message: `422-task-already-started`, stack: new Error().stack});
        }
        if (['report', 'complete'].includes(action) && status !== TaskStatuses.ACTIVE) {
            throw ({status: 422, message: `422-task-${status === TaskStatuses.WAITING ? "didn't-start-yet" : 'already'}${status !== TaskStatuses.WAITING ? '-' + status.toLowerCase() : ''}`, stack: new Error().stack});
        }
    }
}
