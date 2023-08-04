import {Body, Controller, Get, Post, Query, UseGuards, Request, Param, Res} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./users.model";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {PlanMiddleware} from "../middlewares/plan-middleware/plan.middleware";
import {GetWorkersOptions} from "../interfaces/worker-options";

@ApiTags('Users')
@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) {}

    @ApiOperation({summary: 'User creation'})
    @ApiResponse({status: 200, type: User})
    @Post()
    create(@Body() userDto: CreateUserDto) {
        return this.userService.createUser(userDto);
    }

    @ApiOperation({summary: 'Get all users'})
    @ApiResponse({status: 200, type: [User]})
    @Get()
    getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Get('/get-all')
    @UseGuards(JwtAuthGuard)
    getAll(@Request() req) {
        return console.log('req.user = ', req.user)
        // return this.userService.getAllUsers({search, type, companyId});
    }

    @Get('/findQuery')
    getOneUser(
        @Query() findQuery: any,
        // @Query('findQuery') findQuery: object,
    ) {
        return this.userService.getOneUser(findQuery);
    }

    @Get(':id')
    @ApiOperation({ summary: "Getting user by id" })
    @ApiResponse({ status: 200, type: User })
    getUserById(@Param('id') id: number): Promise<User> {
        return this.userService.getUserById(id);
    }

}
