import { Controller, Post, Body, Get, Param, Delete, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from './user.service'; 
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('')
    async getall(){
        return this.usersService.getAllUsers();
    }

    @Post('register')
    async register(@Body() user:any){
        return this.usersService.create(user);
    }

    @Post('registeradmin')
    async createad(@Body() user:any){
        return this.usersService.createadmin(user);
    }

    @Get('id/:username')
    async findOne(@Param('username') username: string) {
      return this.usersService.findOne(username);
    }

    @Delete('id/:id')
    async remove(@Param('id') id:any) {
        return this.usersService.remove(id);
    }

}

