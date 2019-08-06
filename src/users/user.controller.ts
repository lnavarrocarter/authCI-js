import { Controller, Get, Post, Body, Res, HttpStatus, Param, NotFoundException, Put, Query, Delete, UseGuards, UsePipes } from '@nestjs/common';
import { UserServices } from './user.services';
import { AuthGuard } from './../shared/auth.gaurd';
import { ValidationPipe } from './../shared/validation.pipe';
import { UserDTO } from './create-user.dto';
import { User } from './user.decorator';

@Controller()
export class UserController {
    constructor(public userService: UserServices) {}
    @Get('api/users')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    async showAllUser(@User() user, @Res() res) {
        console.log(user);
        const allUsers = await this.userService.showAll();
        return res.status(HttpStatus.OK).json({
            message : 'Usuario(s) encontrado(s) correctamente.',
            user : allUsers,
        });
    }

    @Get('api/users/:id')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    async showOneUser(@Param('id') id, @Res() res) {
        const User = await this.userService.showOne(id);
        return res.status(HttpStatus.OK).json({
            message : 'Usuario encontrado correctamente.',
            user : User,
        });
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    async login(@Body() data: UserDTO) {
        return await this.userService.login(data);
    }

    @Post('register')
    @UsePipes(new ValidationPipe())
    async register(@Body() data: UserDTO) {
        return await this.userService.register(data);
    }


}
