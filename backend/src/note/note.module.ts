import { Module } from '@nestjs/common';
import { NotesService } from './note.service';
import { NotesController } from './note.controller';

@Module({
  providers: [NotesService],
  controllers: [NotesController]
})
export class NoteModule {}
