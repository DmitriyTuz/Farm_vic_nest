import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Payment} from "./payment.model";
import {UsersService} from "../users/users.service";
import {Company} from "../companies/companies.model";
import {PlanTypes} from "../lib/constants";
import {StripeService} from "../stripe/stripe.service";
import {Plan} from "../plans/plans.model";
import {User} from "../users/users.model";

@Injectable()
export class PaymentService {

    constructor(@InjectModel(Payment) private paymentRepository: typeof Payment,
                @InjectModel(Company) private companyRepository: typeof Company,
                @InjectModel(Plan) private planRepository: typeof Plan,
                // @InjectModel(User) private userRepository: typeof User,
                private userService: UsersService,
                private stripeService: StripeService) {}


    async getOnePayment(userId) {
        return this.paymentRepository.findOne({ where: {userId} });
    }

    async createSubscribe(req, res) {
        try {
            const {planType, agree} = req.body;

            const user = await this.userService.getOneUser({id: req.user.id});

            await this.createSubscribePrivat(user, req.params.id, planType, agree);

            return res.status(200).send({
                success: true,
                notice: 'Subscribed'
            });
        } catch (err) {
            throw(err);
        }
    }

    private async createSubscribePrivat(user, paymentId, typePlan, agree) {
        const company = await this.companyRepository.findOne({attributes: ['id', 'hasTrial', 'isTrial'], where: {id: user.companyId}});

        if (typePlan === PlanTypes.FREE) {
            if (company.isTrial) {
                throw ({status: 422, message: '422-you-already-use-free-plan', stack: new Error().stack});
            } else if (company.hasTrial) {
                throw ({status: 422, message: '422-your-trial-plan-expired', stack: new Error().stack});
            } else {
                await this.companyRepository.update({isTrial: true, trialAt: new Date(), hasTrial: true}, {where: {id: user.companyId}});
            }
        } else {
            paymentId = parseInt(paymentId, 10);
            if (!paymentId) throw ({status: 404, message: '404-payment-id-not-found', stack: new Error().stack });
            const payment = await this.paymentRepository.findOne({attributes: ['id', 'userId', 'subscriberId', 'customerId', 'agree'], where: {id: paymentId}});

            if (!payment) {
                throw ({status: 404, message: '404-payment-not-found', stack: new Error().stack});
            }

            if (!payment.agree && !agree) {
                throw ({status: 422, message: '422-please-confirm-the-agreement', stack: new Error().stack});
            }

            const plan = await this.planRepository.findOne({attributes: ['stripeId'], where: {name: typePlan}});

            if (!plan) {
                throw ({status: 404, message: '404-plan-not-found', stack: new Error().stack});
            }

            const subscriber = await this.stripeService.createSubscribers({
                customer: payment.customerId,
                price: plan.stripeId
            }, user);

            await this.companyRepository.update({isSubscribe: true, isTrial: false, trialAt: null}, {where: {id: user.companyId}});
            await this.paymentRepository.update({subscriberId: subscriber.id, paidAt: new Date(), agree: payment.agree || agree},  {where: {id: payment.id}})
        }
    };

    // async removeSubscribe(payment: Payment) {
    //     const user = await User.findOne({attributes: ['id', 'companyId'], where: {id: payment.userId}});
    //     const company = await this.companyRepository.findOne({attributes: ['id', 'isTrial'], where: {id: user.companyId}});
    //
    //     if (company.isTrial) {
    //         await this.companyRepository.update({isTrial: false}, {where: {id: user.companyId}});
    //     } else if (payment?.subscriberId) {
    //         await Promise.all([
    //             this.stripeService.cancelSubscribe(payment.subscriberId),
    //             this.companyRepository.update({isSubscribe: false}, {where: {id: user.companyId}}),
    //             this.paymentRepository.update({subscriberId: null}, {where: {id: payment.id}})
    //         ]);
    //
    //         console.log('The Subscribe has been cancelled successfully')
    //     }
    // }
}
