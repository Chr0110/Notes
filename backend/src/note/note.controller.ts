import { Controller, Post, Body, UseGuards, Request, Req, Get, Delete, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { NotesService } from './note.service';

@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
    constructor(private notesService: NotesService) {}
    @Post('write')
    async write(@Body() note:any, @Req() req: any)
    {
    return this.notesService.create(note, req);
    }

    @Get('')
    async note(@Req() req){
      return this.notesService.findAll(req.user.userId);
    }

    @Delete('id/:noteid')
    async remove(@Param('noteid') noteid:any){
      return this.notesService.delete(noteid);
    }
}
