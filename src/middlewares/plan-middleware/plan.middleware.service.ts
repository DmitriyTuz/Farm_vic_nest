import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserTypes } from '../../lib/constants';
import {User} from "../../users/users.model";
import {InjectModel} from "@nestjs/sequelize";
import {Company} from "../../companies/companies.model";
import {StripeService} from "../../stripe/stripe.service";

declare global {
    namespace Express {
        interface Request {
            user: User; // Используйте здесь тип вашего пользователя
        }
    }
}

@Injectable()
export class PlanMiddlewareService implements NestMiddleware {
    constructor(@InjectModel(User) private userRepository: typeof User,
                @InjectModel(Company) private companyRepository: typeof Company,
                private stripeService: StripeService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.userRepository.findOne({
                attributes: ['id', 'companyId', 'type'],
                where: {id: req.user.id}
            });
            const company = await this.companyRepository.findOne({
                attributes: ['id', 'isTrial', 'trialAt', 'isSubscribe'],
                where: {id: user.companyId}
            });

            if (user.type !== UserTypes.SUPER_ADMIN) {
                if (company.isTrial) {
                    const isExpired = this.stripeService.checkTrialDays(new Date(), company.trialAt);
                    if (isExpired) {
                        await company.update({isTrial: false, trialAt: null})
                    }
                } else if (!company.isSubscribe) {
                    throw ({status: 422, message: '422-your-subscription-has-been-expired', stack: new Error().stack});
                }
            }

            next();
        } catch (err) {
            next(err);
        }
    }
}