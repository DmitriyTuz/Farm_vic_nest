import {Injectable} from '@nestjs/common';
import {Model, Sequelize} from "sequelize-typescript";
const jwt = require('jsonwebtoken');
// import jwt from "jsonwebtoken";
// const {JWT_SECRET, JWT_EXPIRED_TIME} = require('../../../credentials').config
import Credentials from "../../../credentials";

@Injectable()
export class HelpersService {

    getModelFields(model: typeof Model, unnecessaryFields: any[], allFields: boolean, isAttributes: boolean, modelName: string): string[] {

        try {
            const attributes: any[] = [];
            const rawAttributes = model.rawAttributes;

            let activeFields: string[]  = [];
            const notUpdatedFields = ['id', 'createdAt', 'updatedAt'];

            if (!allFields) {
                activeFields = activeFields.concat(notUpdatedFields);
            }

            activeFields = activeFields.concat(unnecessaryFields);

            for (const attribute in rawAttributes) {
                if (!activeFields.includes(attribute)) {
                    // if (rawAttributes.hasOwnProperty(attribute)) {
                    attributes.push(attribute);
                }
            }

            if (isAttributes) {
                const datesList = ['completedAt', 'createdAt', 'updatedAt', 'registrationDate', 'lastActive'];
                attributes.forEach((m:string, i:number) => {
                    if (datesList.includes(m)) {
                        attributes[i] = [Sequelize.literal(`extract(epoch from "${modelName}"."${m}") * 1000`), `${m}`];
                    }
                })
            }

            return attributes;

        } catch (err) {
            throw (err);
        }
    }

    sendResponse(user, responseData, res) {
        if (user?.id) {
            console.log('Credentials.config.JWT_SECRET = ', Credentials.config.JWT_SECRET)
            const token = jwt.sign({id: user.id}, Credentials.config.JWT_SECRET);
            res.cookie('AuthorizationToken', token, { maxAge: Credentials.config.JWT_EXPIRED_TIME, httpOnly: true });
        }

        res.status(200).send(responseData);
    }

}
