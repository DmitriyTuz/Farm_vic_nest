import {Controller, Post, Req, Res, UseGuards} from '@nestjs/common';
import {Request, Response} from "express";
import {PaymentService} from "./payment.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {PlanMiddlewareService} from "../middlewares/plan-middleware/plan.middleware.service";
import {UsersService} from "../users/users.service";
import {UserTypes} from "../lib/constants";
import {Payment} from "./payment.model";

@Controller()
export class PaymentController {

    constructor(private paymentService: PaymentService,
                private userService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Post('/api/payment/:id/create-subscribe')
    async createSubscribe(@Req() req: Request, @Res() res: Response) {

        const user = await this.userService.getOneUser({id: req.user.id});
        return this.paymentService.createSubscribe(req, res, user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/api/payment/:id/remove-subscribe')
    async removeSubscribe(@Req() req: Request, @Res() res: Response) {

        const user = await this.userService.getOneUser({id: req.user.id});

        if (!user) {
            throw ({status: 404, message: '404-user-not-found', stack: new Error().stack});
        }

        console.log('!!! user.company.ownerId = ', user.company.ownerId)

        // if (user.type === UserTypes.ADMIN && user.company.ownerId === user.id && user.company.isSubscribe) {
            const payment = await Payment.findOne({attributes: ['id', 'userId', 'subscriberId', 'customerId'], where: {userId: user.id}});

            console.log('!!! payment.id = ', payment.id)

            if (payment) {
                return await this.paymentService.removeSubscribe(req, res, payment);
            }
        // }

    }

    @UseGuards(JwtAuthGuard)
    @Post('/api/payment')
    async create(@Req() req: Request, @Res() res: Response) {

        const user = await this.userService.getOneUser({id: req.user.id});
        return this.paymentService.create(req, res, user);
    }

}
