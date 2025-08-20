import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ResearchDocumentsService } from './research-documents.service';
import { CreateResearchDocumentDto } from './dto/create-research-document.dto';
import { UpdateResearchDocumentDto } from './dto/update-research-document.dto';
import { SearchResearchDocumentDto } from './dto/integration-research-document.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AbilitiesGuard } from 'src/guards/abilities.guard';
import { CheckAbility } from 'src/Decorator/abilities.decorator';
import { ResearchDocument } from './entities/research-document.entity';
import { Action } from 'src/ability/ability.factory';

@UseGuards(JwtAuthGuard, AbilitiesGuard)
@Controller('research-documents')
export class ResearchDocumentsController {
  constructor(private readonly researchDocumentsService: ResearchDocumentsService) {}

  @CheckAbility({ action: Action.Create, subject: ResearchDocument })
  @Post()
  create(@Body() createResearchDocumentDto: CreateResearchDocumentDto) {
    return this.researchDocumentsService.create(createResearchDocumentDto);
  }

  @CheckAbility({ action: Action.Read, subject: ResearchDocument })
  @Post('search')
  async findAll(
    @Body()
    searchDto: SearchResearchDocumentDto,
  ) {
    return this.researchDocumentsService.findAll(searchDto);
  }

  @CheckAbility({ action: Action.Read, subject: ResearchDocument })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.researchDocumentsService.findOne(id);
  }

  @CheckAbility({ action: Action.Update, subject: ResearchDocument })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateResearchDocumentDto: UpdateResearchDocumentDto,
  ) {
    return this.researchDocumentsService.update(id, updateResearchDocumentDto);
  }

  @CheckAbility({ action: Action.Delete, subject: ResearchDocument })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.researchDocumentsService.remove(id);
  }

  @CheckAbility({ action: Action.Read, subject: ResearchDocument })
  @Get('project/:projectId')
  async findByProject(@Param('projectId') projectId: string) {
    return this.researchDocumentsService.findByProjectId(projectId);
  }

  @CheckAbility({ action: Action.Read, subject: ResearchDocument })
  @Get('search/tags')
  async searchByTags(@Query('tags') tags: string[]) {
    return this.researchDocumentsService.getDocumentsByTags(
      Array.isArray(tags) ? tags : tags ? [tags] : [],
    );
  }
}
