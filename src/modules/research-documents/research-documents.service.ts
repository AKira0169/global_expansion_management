import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateResearchDocumentDto } from './dto/create-research-document.dto';
import { UpdateResearchDocumentDto } from './dto/update-research-document.dto';
import { SearchResearchDocumentDto } from './dto/integration-research-document.dto';
import { Project } from '../projects/entities/project.entity';
import { ResearchDocument, ResearchDocumentDocument } from './entities/research-document.entity';

@Injectable()
export class ResearchDocumentsService {
  constructor(
    @InjectModel(ResearchDocument.name)
    private researchDocumentModel: Model<ResearchDocumentDocument>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(
    createResearchDocumentDto: CreateResearchDocumentDto,
  ): Promise<ResearchDocumentDocument> {
    const project = await this.projectRepository.findOne({
      where: { id: createResearchDocumentDto.projectId },
    });
    if (!project) {
      throw new NotFoundException(
        `Project with ID ${createResearchDocumentDto.projectId} not found`,
      );
    }
    const document = new this.researchDocumentModel({
      ...createResearchDocumentDto,
      projectId: project.id,
    });

    const savedDocument = await document.save();
    return savedDocument;
  }

  async findAll(searchDto: SearchResearchDocumentDto) {
    const filter: FilterQuery<ResearchDocumentDocument> = {};
    // Regex search on title + content
    if (searchDto.textSearch) {
      const searchRegex = new RegExp(searchDto.textSearch, 'i');
      filter.$or = [{ title: searchRegex }, { content: searchRegex }];
    }
    // Tags search (case-insensitive regex for each tag)
    if (searchDto.tags && searchDto.tags.length > 0) {
      filter.tags = {
        $in: searchDto.tags.map((tag) => new RegExp(tag, 'i')),
      };
    }
    // Project filter
    if (searchDto.projectId) {
      filter.projectId = searchDto.projectId;
    }
    // One query only
    return this.researchDocumentModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findByProjectId(projectId: string) {
    return this.researchDocumentModel.find({ projectId }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<ResearchDocumentDocument> {
    const document = await this.researchDocumentModel.findById(id).exec();
    if (!document) {
      throw new NotFoundException(`Research document with ID ${id} not found`);
    }
    return document;
  }

  async update(id: string, updateResearchDocumentDto: UpdateResearchDocumentDto) {
    return await this.researchDocumentModel
      .findByIdAndUpdate(id, updateResearchDocumentDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return await this.researchDocumentModel.findByIdAndDelete(id).exec();
  }

  async getDocumentsByTags(tags: string[]): Promise<ResearchDocumentDocument[]> {
    return this.researchDocumentModel
      .find({
        tags: {
          $in: tags.map((tag) => new RegExp(tag, 'i')),
        },
      })
      .sort({ createdAt: -1 })
      .exec();
  }
}
