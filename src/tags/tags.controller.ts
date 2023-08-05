import {Controller, Get, Query, Request, Res, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {TagsService} from "./tags.service";
import {TagOptions} from "../interfaces/tag-options.interface";
import {Response} from "express";
import {PlanMiddlewareService} from "../middlewares/plan-middleware/plan.middleware.service";
import {GetWorkersOptions} from "../interfaces/worker-options";
import {UsersService} from "../users/users.service";

@Controller()
export class TagsController {

    constructor(private tagService: TagsService,
                private userService: UsersService) {}

    @Get('/api/tags')
    @UseGuards(JwtAuthGuard, PlanMiddlewareService)
    async getAll(@Query() tagOptions: TagOptions, @Request() req, @Res() res: Response) {
        return this.tagService.getAll(tagOptions, req.user.id, res);
    }

    @Get('/api/worker-tags')
    @UseGuards(JwtAuthGuard, PlanMiddlewareService)
    async getAllWorkers(@Query() workerOptions: GetWorkersOptions, @Request() req) {
        return this.userService.getAllWorkers(workerOptions, req.user.id);
    }

}
