import {Body, Controller, Post, Req, Res} from '@nestjs/common';
import { Request, Response } from 'express';
import {AuthService} from "./auth.service";

@Controller()
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('/api/login')
    login(@Body() reqBody: any, @Req() req: Request, @Res() res: Response) {
        console.log('reqBody = ', reqBody)
        return this.authService.login(reqBody, req, res);
    }
}
