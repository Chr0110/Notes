// src/microservices/notes.microservice.ts
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { Module, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller()
class NotesController {
  // Create note (matching your POST /notes/write endpoint)
  @MessagePattern({ cmd: 'notes_write' })
  async createNote(data: { title: string; content: string; userId: string }) {
    try {
      if (!data.userId) {
        return { success: false, error: 'User ID not found' };
      }

      const note = await prisma.note.create({
        data: {
          title: data.title,
          content: data.content,
          author: { connect: { id: data.userId } },
        },
      });

      return { success: true, note };
    } catch (error) {
      console.log(error)
      return { success: false, error: error.message };
    }
  }

  // Get all notes for a user (matching your GET /notes endpoint)
  @MessagePattern({ cmd: 'notes_get_all' })
  async getUserNotes(data: { authorId: string }) {
    try {
      const notes = await prisma.note.findMany({
        where: { authorId: data.authorId },
        orderBy: { createdAt: 'desc' },
      });
      return { success: true, notes };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get single note
  @MessagePattern({ cmd: 'get_note' })
  async getNote(data: { id: string }) {
    try {
      const note = await prisma.note.findUnique({
        where: { id: data.id },
        include: { 
          author: { 
            select: { 
              id: true,
              username: true 
            } 
          } 
        },
      });

      if (!note) {
        return { success: false, error: 'Note not found' };
      }

      return { success: true, note };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete note (matching your DELETE /notes/id/:noteid endpoint)
  @MessagePattern({ cmd: 'notes_delete' })
  async deleteNote(data: { id: string }) {
    try {
      await prisma.note.delete({
        where: { id: data.id },
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Note not found or already deleted' };
    }
  }

  // Update note (bonus - you might want this)
  @MessagePattern({ cmd: 'update_note' })
  async updateNote(data: { id: string; title?: string; content?: string }) {
    try {
      const note = await prisma.note.update({
        where: { id: data.id },
        data: {
          ...(data.title && { title: data.title }),
          ...(data.content && { content: data.content }),
        },
      });
      return { success: true, note };
    } catch (error) {
      return { success: false, error: 'Note not found' };
    }
  }
}

@Module({
  controllers: [NotesController],
})
class NotesModule {}

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotesModule,
    {
      transport: Transport.TCP,
      options: { host: 'localhost', port: 3002 },
    },
  );
  await app.listen();
  console.log('📝 Notes Microservice running on port 3002');
}
bootstrap();