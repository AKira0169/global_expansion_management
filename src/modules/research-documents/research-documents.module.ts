import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResearchDocumentsService } from './research-documents.service';
import { ResearchDocumentsController } from './research-documents.controller';
import { ResearchDocument, ResearchDocumentSchema } from './entities/research-document.entity';
import { Project } from '../projects/entities/project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ResearchDocument.name, schema: ResearchDocumentSchema }]),
    TypeOrmModule.forFeature([Project]),
  ],
  controllers: [ResearchDocumentsController],
  providers: [ResearchDocumentsService],
  exports: [
    ResearchDocumentsService,
    MongooseModule.forFeature([{ name: ResearchDocument.name, schema: ResearchDocumentSchema }]),
  ],
})
export class ResearchDocumentsModule {}
