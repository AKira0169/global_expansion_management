import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { In, Repository } from 'typeorm';
import { ProjectStatus } from './enums/ProjectStatus';
import { User } from 'src/users/entities/user.entity';
import { Action, AppAbility } from 'src/ability/ability.factory';
import { subject } from '@casl/ability';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}
  async create(createProjectDto: CreateProjectDto, user: User) {
    return await this.projectRepository.save({
      ...createProjectDto,
      user,
      status: ProjectStatus.PENDING,
    });
  }
  async findAll(user: User, userIds: string, ability: AppAbility) {
    let userIdsArray;
    if (userIds) {
      userIdsArray = userIds.split(',');
    } else {
      userIdsArray = [user.id];
    }
    const projects = await this.projectRepository.find({
      where: {
        user: {
          id: In(userIdsArray),
        },
      },
      relations: ['user'],
    });
    for (const project of projects) {
      console.log(project);
      if (!ability.can(Action.Read, subject('Project', project))) {
        throw new ForbiddenException('You are not allowed to view this project');
      }
    }
    return projects;
  }

  async findOne(id: string, ability: AppAbility) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    if (!ability.can(Action.Read, project)) {
      throw new ForbiddenException('You do not have permission to read this project');
    }
    return project;
  }
  async update(id: string, updateProjectDto: UpdateProjectDto) {
    return await this.projectRepository.update(id, updateProjectDto);
  }
  async remove(id: string) {
    return await this.projectRepository.delete(id);
  }
  async findByUserId(userId: string) {
    return await this.projectRepository.find({
      where: { userId },
      relations: ['user'],
    });
  }
}
