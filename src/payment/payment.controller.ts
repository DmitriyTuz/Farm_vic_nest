import {Controller, Post, Req, Res, UseGuards} from '@nestjs/common';
import {Request, Response} from "express";
import {PaymentService} from "./payment.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {PlanMiddlewareService} from "../middlewares/plan-middleware/plan.middleware.service";

@Controller()
export class PaymentController {

    constructor(private paymentService: PaymentService) {}

    @UseGuards(JwtAuthGuard)
    @Post('/api/payment/:id/create-subscribe')
    async createSubscribe(@Req() req: Request, @Res() res: Response) {
        return this.paymentService.createSubscribe(req, res);
    }
}
