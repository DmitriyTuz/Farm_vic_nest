import {Controller, Get, Query, Request, Res, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {TagsService} from "./tags.service";
import {TagOptions} from "../interfaces/tag-options.interface";
import {Response} from "express";
import {PlanMiddleware} from "../middlewares/plan-middleware/plan.middleware";

@Controller()
export class TagsController {

    constructor(private tagService: TagsService) {}

    @Get('/api/tags')
    @UseGuards(JwtAuthGuard, PlanMiddleware)
    async getAll(@Query() tagOptions: TagOptions, @Request() req, @Res() res: Response) {
        return this.tagService.getAll(tagOptions, req.user.id, res);
    }

}
