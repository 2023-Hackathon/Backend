import { Body, Controller, Get, Post, Put, Res, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserRq } from './rq/create-user.rq';
import { UpdateUserParentRq } from './rq/update-user-parent.rq';
import * as ApiPath from '../../common/path/ApiPath'
import { ApiTags } from '@nestjs/swagger/dist';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { ApiResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { LoginRq } from './rq/login.rq';
import { Response } from 'express';
import { Token } from 'src/auth/models/token.model';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { GetUser } from 'src/auth/decorator/getUserDecorator';
import { UserDto } from 'src/auth/dtos/user.dto';
import { ApiCookieAuth } from '@nestjs/swagger/dist/decorators/api-cookie.decorator';

@Controller(ApiPath.USER)
@ApiTags('유저')
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Post(ApiPath.USER_CREATE)
    @ApiOperation({ summary: "유저 생성" })
    @ApiResponse({
        status: 200
    })
    createUser(@Body() rq: CreateUserRq) {
        return this.userService.CreateUser(rq);
    }

    @Post(ApiPath.USER_LOGIN)
    @ApiOperation({ summary: "유저 로그인" })
    @ApiResponse({
        status: 200,
        type: Token
    })
    login(
        @Res({ passthrough: true }) rs: Response,
        @Body() rq: LoginRq) {
        return this.userService.Login(rs, rq);
    }

    @Get()
    @ApiOperation({ summary: "내 정보" })
    @ApiResponse({
        status: 200,
        type: UserDto
    })
    @ApiCookieAuth()
    @UseGuards(JwtAuthGuard)
    getUser(@GetUser() user: UserDto) {
        return user;
    }

    @Put(ApiPath.USER_SETTING)
    @ApiOperation({ summary: "보호자 설정" })
    @ApiResponse({
        status: 200
    })
    @ApiCookieAuth()
    @UseGuards(JwtAuthGuard)
    updateUserParent(
        @GetUser() user: UserDto,
        @Body() rq: UpdateUserParentRq
    ) {
        return this.userService.UpdateUserParent(user, rq);
    }

}
