import { Body, Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotesService {
    async delete(id: string) {
      return this.prisma.note.delete({
        where: { id },
      });
    }
    constructor(private prisma: PrismaService) {}
    
    async findAll(authorId: string) {
      return this.prisma.note.findMany({
        where: { authorId },
      });
    }

    async create(@Body() note: any, @Req() req:any) {
      if (!req.user.userId) {
        throw new Error('User ID not found');
      }
      // console.log(req);
        return this.prisma.note.create({
          data: {
            title: note.title,
            content: note.content,
            author: { connect: { id: req.user.userId } },
          },
        });
      }
}
