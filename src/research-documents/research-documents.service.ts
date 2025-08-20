import { Injectable } from '@nestjs/common';
import { CreateResearchDocumentDto } from './dto/create-research-document.dto';
import { UpdateResearchDocumentDto } from './dto/update-research-document.dto';

@Injectable()
export class ResearchDocumentsService {
  create(createResearchDocumentDto: CreateResearchDocumentDto) {
    return 'This action adds a new researchDocument';
  }

  findAll() {
    return `This action returns all researchDocuments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} researchDocument`;
  }

  update(id: number, updateResearchDocumentDto: UpdateResearchDocumentDto) {
    return `This action updates a #${id} researchDocument`;
  }

  remove(id: number) {
    return `This action removes a #${id} researchDocument`;
  }
}
