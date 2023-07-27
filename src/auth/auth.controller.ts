import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {LoginUserDto} from "./dto/login-user.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("/login")
    login(@Body() reqBody: any) {
        return this.authService.login(reqBody);
    }
}
