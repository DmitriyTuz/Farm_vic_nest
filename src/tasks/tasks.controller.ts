import {Body, Controller, Post, Query, Request, Res, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {PlanMiddlewareService} from "../middlewares/plan-middleware/plan.middleware.service";
import {Response} from "express";
import {TasksService} from "./tasks.service";
import {TasksOptions} from "../interfaces/task-options";

@Controller()
export class TasksController {

    constructor(private taskService: TasksService) {}

    @Post('/api/tasks')
    @UseGuards(JwtAuthGuard, PlanMiddlewareService)
    getAll(@Body() reqBody: TasksOptions, @Request() req, @Res() res: Response) {
        return this.taskService.getAll(reqBody, req.user.id, res);
    }

}
