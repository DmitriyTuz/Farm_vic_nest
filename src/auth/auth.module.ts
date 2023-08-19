import { forwardRef, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {CheckerModule} from "../lib/checker/checker.module";
import {HelpersModule} from "../lib/helpers/helpers.module";
import {PasswordModule} from "../lib/password/password.module";
import {CompaniesModule} from "../companies/companies.module";


@Module({
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    imports: [
        // forwardRef(() => UsersModule),
        UsersModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || "SECRET",
            signOptions: {
                expiresIn: "24h",
            },
        }),
        PassportModule,
        CheckerModule,
        HelpersModule,
        PasswordModule,
        CompaniesModule
    ],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}
