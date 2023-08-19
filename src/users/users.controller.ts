import {Body, Controller, Get, Post, Query, UseGuards, Param, Res, Patch, Req, Delete} from '@nestjs/common';
import {UsersService} from "./users.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./users.model";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {PlanMiddlewareService} from "../middlewares/plan-middleware/plan.middleware.service";
import {Request, Response} from "express";
import {UsersOptions} from "../interfaces/user-options";

@ApiTags('Users')
@Controller('api/users')
export class UsersController {

    constructor(private userService: UsersService) {}

    @Post()
    @UseGuards(JwtAuthGuard, PlanMiddlewareService)
    create(@Req() req: Request, @Res() res: Response) {
        return this.userService.create(req.user.id, req, res);
    }

    @ApiOperation({summary: 'User creation'})
    @ApiResponse({status: 200, type: User})
    @Post('/create-user')
    createUser(@Body() userDto) {
        return this.userService.createUser(userDto);
    }

    // @ApiOperation({summary: 'Get all users'})
    // @ApiResponse({status: 200, type: [User]})
    // @Get()
    // getAllUsers() {
    //     return this.userService.getAllUsers();
    // }

    @Get()
    @UseGuards(JwtAuthGuard)
    getAll(@Body() reqBody: UsersOptions, @Req() req: Request, @Res() res: Response) {
        return this.userService.getAll(reqBody, req.user.id, req, res);
    }

    @Get('/findQuery')
    getOneUser(
        @Query() findQuery: any,
        // @Query('findQuery') findQuery: object,
    ) {
        return this.userService.getOneUser(findQuery);
    }

    @Get('/:id')
    @ApiOperation({ summary: "Getting user by id" })
    @ApiResponse({ status: 200, type: User })
    getUserById(@Param('id') id: number): Promise<User> {
        return this.userService.getUserById(id);
    }

    @Patch('/onboard')
    @UseGuards(JwtAuthGuard, PlanMiddlewareService)
    updateOnboardUser(@Req() req: Request, @Res() res: Response) {
        return this.userService.updateOnboardUser(req.user.id, res);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/:id')
    update(@Req() req: Request, @Res() res: Response): Promise<User> {
        return this.userService.update(req, res);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    remove(@Req() req: Request, @Res() res: Response): Promise<void> {
        return this.userService.remove(req, res);
    }

}
