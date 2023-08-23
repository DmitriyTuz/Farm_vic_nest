import {Controller, Get, Query, Request, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {PlanMiddlewareService} from "../middlewares/plan-middleware/plan.middleware.service";
import {LocationsService} from "./locations.service";
import {UsersService} from "../users/users.service";

@Controller()
export class LocationsController {

    constructor(private locationService: LocationsService,
                private userService: UsersService) {}

    @Get('/api/locations')
    @UseGuards(JwtAuthGuard, PlanMiddlewareService)
    async getAll(@Request() req) {
        const user = await this.userService.getOneUser({id: req.user.id});
        return this.locationService.getAll(user);
    }

}
