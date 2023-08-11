import {Body, Controller, Get, Post, Req, Res, UseGuards} from '@nestjs/common';
import { Request, Response } from 'express';
import {AuthService} from "./auth.service";
import {JwtAuthGuard} from "./jwt-auth.guard";

@Controller()
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('/api/sign-up')
    signUp(@Body() reqBody: any, @Req() req: Request, @Res() res: Response) {
        return this.authService.signUp(reqBody, req, res);
    }

    @Post('/api/login')
    login(@Body() reqBody: any, @Req() req: Request, @Res() res: Response) {
        return this.authService.login(reqBody, req, res);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/api/logout')
    logout(@Req() req: Request, @Res() res: Response) {
        return this.authService.logout(req, res);
    }
}
