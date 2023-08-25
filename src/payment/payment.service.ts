import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Payment} from "./payment.model";
import {Company} from "../companies/companies.model";
import {PlanTypes} from "../lib/constants";
import {StripeService} from "../stripe/stripe.service";
import {Plan} from "../plans/plans.model";
import {User} from "../users/users.model";
import {CheckerService} from "../lib/checker/checker.service";
const moment = require('moment');

@Injectable()
export class PaymentService {

    constructor(@InjectModel(Payment) private paymentRepository: typeof Payment,
                @InjectModel(Company) private companyRepository: typeof Company,
                @InjectModel(Plan) private planRepository: typeof Plan,
                @InjectModel(User) private userRepository: typeof User,
                private checkerService: CheckerService,
                private stripeService: StripeService) {}

    async getOnePayment(userId) {
        return this.paymentRepository.findOne({ where: {userId} });
    }

    async create(req, res, user: User) {
        try {
            req.body.expiration = `${moment(req.body.exp_month, 'M').format('MM')}/${moment(req.body.exp_year, 'YYYY').format('YY')}`;

            if (user.company.isSubscribe) {
                throw ({status: 422, message: '422-the-subscribe-still-active', stack: new Error().stack});
            }

            let payment = await this.getOnePayment(user.id);

            if (payment) {
                await this.deletePayment(req, res, payment.id);
            }

            payment = await this.createPayment(user, req.body);

            return res.status(200).send({
                success: true,
                notice: 'The payment has been created',
                data: {payment}
            });
        } catch (err) {
            throw err;
        }
    }

    private async createPayment(user: User, newPaymentInfo) {
        const requiredFields = ['number', 'token', 'cardType','expiration'];
        this.checkerService.checkRequiredFields(newPaymentInfo, requiredFields, false);

        const {number, cardType, nameOnCard, expiration, token, agree} = newPaymentInfo;
        const customer = await this.stripeService.customerCreate(token, user.phone, user.name);

        const newPayment = {
            userId: user.id,
            number: number.toString(),
            cardType,
            nameOnCard,
            expiration,
            customerId: customer.id,
            type: 'Stripe',
            agree: !!agree
        };

        return this.paymentRepository.create(newPayment);
    }

    private async deletePayment(req, res, paymentId: number) {
        const payment = await this.paymentRepository.findOne({attributes: ['id', 'subscriberId', 'userId'], where: {id: paymentId}});

        if (!payment) {
            throw ({status: 404, message: '404-payment-not-found', stack: new Error().stack});
        }

        await this.removeSubscribe(req, res, payment);
        await this.paymentRepository.destroy({where: {id: paymentId}});
    }

    async createSubscribe(req, res, user) {

        try {

            const {planType, agree} = req.body;

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

    async removeSubscribe(req, res, payment: Payment) {
        const user = await this.userRepository.findOne({attributes: ['id', 'companyId'], where: {id: payment.userId}});
        const company = await this.companyRepository.findOne({attributes: ['id', 'isTrial'], where: {id: user.companyId}});

        if (company.isTrial) {
            await this.companyRepository.update({isTrial: false}, {where: {id: user.companyId}});
        } else if (payment?.subscriberId) {
            await Promise.all([
                this.stripeService.cancelSubscribe(payment.subscriberId),
                this.companyRepository.update({isSubscribe: false}, {where: {id: user.companyId}}),
                this.paymentRepository.update({subscriberId: null}, {where: {id: payment.id}})
            ]);

            console.log('The Subscribe has been cancelled successfully')
        }

        const response = {
            success: true,
            notice: 'Subscribed'
        }
        return response;
    }

}
