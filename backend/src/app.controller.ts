import { 
  Controller, 
  Post, 
  Get, 
  Delete, 
  Body, 
  Param, 
  Inject,
  UseGuards,
  Request,
  Req,
  HttpException,
  HttpStatus,
  UnauthorizedException
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    @Inject('NOTES_SERVICE') private notesClient: ClientProxy,
  ) {}
  
  @Post('auth/login')
  async login(@Body() body: { username: string; password: string }) {
    const result = await firstValueFrom(
      this.authClient.send({ cmd: 'login' }, body)
    );
    if (!result.success) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { access_token: result.access_token };
  }
  
  @Get('users')
  async getall() {
    const result = await firstValueFrom(
      this.authClient.send({ cmd: 'get_all_users' }, {})
    );
    return result.users;
  }

  @Post('users/register')
  async register(@Body() user: any) {
    const result = await firstValueFrom(
      this.authClient.send({ cmd: 'register' }, user)
    );
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Post('users/registeradmin')
  async createad(@Body() user: any) {
    const result = await firstValueFrom(
      this.authClient.send({ cmd: 'register_admin' }, user)
    );
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Get('users/id/:username')
  async findOne(@Param('username') username: string) {
    const result = await firstValueFrom(
      this.authClient.send({ cmd: 'find_user' }, { username })
    );
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.NOT_FOUND);
    }
    return result.user;
  }

  @Delete('users/id/:id')
  async remove(@Param('id') id: any) {
    const result = await firstValueFrom(
      this.authClient.send({ cmd: 'delete_user' }, { id })
    );
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.NOT_FOUND);
    }
    return result;
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('notes/write')
  async write(@Body() note: any, @Req() req: any) {
    const result = await firstValueFrom(
      this.notesClient.send({ cmd: 'notes_write' }, {
        title: note.title,
        content: note.content,
        userId: req.user.userId
      })
    );
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return result.note;
  }

  @UseGuards(JwtAuthGuard)
  @Get('notes')
  async note(@Req() req: any) {
    const result = await firstValueFrom(
      this.notesClient.send({ cmd: 'notes_get_all' }, { 
        authorId: req.user.userId 
      })
    );
    return result.notes;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('notes/id/:noteid')
  async removeNote(@Param('noteid') noteid: any) {
    const result = await firstValueFrom(
      this.notesClient.send({ cmd: 'notes_delete' }, { id: noteid })
    );
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.NOT_FOUND);
    }
    return result;
  }
}