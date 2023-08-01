// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, ExtractJwt } from 'passport-jwt';
// import { JwtPayload } from '../../interfaces/jwt-payload.interface';
// import {UsersService} from "../../users/users.service";
//
// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//     constructor(
//
//         private userService: UsersService,
//
//     ) {
//         super({
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//             secretOrKey: process.env.JWT_SECRET,
//         });
//     }
//
//     async validate(payload: JwtPayload) {
//         return this.userService.getUserByEmail(payload.email);
//     }
// }

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';
import { UsersService } from '../../users/users.service';
import { Request } from 'express'; // Импортируем Request

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Извлекаем токен из заголовка Authorization (Bearer токен)
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: JwtPayload) {
        return this.userService.getUserById(payload.id);
    }

    // Добавим метод для извлечения токена из куки
    private getTokenFromCookie(req: Request): string | null {
        if (req?.cookies) {
            return req.cookies['AuthorizationToken'] || null;
        }
        return null;
    }

    // Переопределяем функцию из passport-jwt для получения токена из куки
    authenticate(req: Request, options?: any): any {
        const token = this.getTokenFromCookie(req);
        if (token) {
            req.headers['authorization'] = `Bearer ${token}`;
        }
        return super.authenticate(req, options);
    }
}