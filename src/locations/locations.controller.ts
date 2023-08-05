import {Controller, Get, Query, Request, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {PlanMiddlewareService} from "../middlewares/plan-middleware/plan.middleware.service";
import {LocationsService} from "./locations.service";

@Controller()
export class LocationsController {

    constructor(private locationService: LocationsService) {}

    @Get('/api/locations')
    @UseGuards(JwtAuthGuard, PlanMiddlewareService)
    async getAll(@Request() req) {
        return this.locationService.getAll(req.user.id);
    }

}
