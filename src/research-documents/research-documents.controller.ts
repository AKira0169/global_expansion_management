import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResearchDocumentsService } from './research-documents.service';
import { CreateResearchDocumentDto } from './dto/create-research-document.dto';
import { UpdateResearchDocumentDto } from './dto/update-research-document.dto';

@Controller('research-documents')
export class ResearchDocumentsController {
  constructor(private readonly researchDocumentsService: ResearchDocumentsService) {}

  @Post()
  create(@Body() createResearchDocumentDto: CreateResearchDocumentDto) {
    return this.researchDocumentsService.create(createResearchDocumentDto);
  }

  @Get()
  findAll() {
    return this.researchDocumentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.researchDocumentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResearchDocumentDto: UpdateResearchDocumentDto) {
    return this.researchDocumentsService.update(+id, updateResearchDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.researchDocumentsService.remove(+id);
  }
}
