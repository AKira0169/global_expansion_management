import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { DataSource, In, Repository } from 'typeorm';
import { ProjectStatus } from './enums/ProjectStatus';
import { User } from 'src/modules/users/entities/user.entity';
import { Action, AppAbility } from 'src/ability/ability.factory';
import { subject } from '@casl/ability';
import { Vendor } from 'src/modules/vendors/entities/vendor.entity';
import { Match } from 'src/modules/matches/entities/match.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private dataSource: DataSource,
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
  async rebuildProjectVendorMatching(projectId: string) {
    const projectRepo = this.dataSource.getRepository(Project);
    const vendorRepo = this.dataSource.getRepository(Vendor);
    const matchRepo = this.dataSource.getRepository(Match);

    const project = await projectRepo.findOneBy({ id: projectId });
    if (!project) throw new Error('Project not found');

    // Split arrays since simple-array = comma-separated strings
    const projectServices = project.services_needed || [];
    const projectCountry = project.country;

    // Find vendors that support the same country
    const vendors = await vendorRepo
      .createQueryBuilder('vendor')
      .where('FIND_IN_SET(:country, vendor.countries_supported)', {
        country: projectCountry,
      })
      .getMany();

    for (const vendor of vendors) {
      const vendorServices = vendor.services_offered || [];
      // Compute service overlap
      const overlap = projectServices.filter((s) => vendorServices.includes(s));
      if (overlap.length === 0) continue; // must have at least one overlap
      // SLA_weight: simple example = inverse of SLA hours (faster = higher score)
      const slaWeight = vendor.response_sla_hours ? 1 / vendor.response_sla_hours : 0;
      const score = overlap.length * 2 + Number(vendor.rating) + slaWeight;
      // UPSERT logic
      await matchRepo
        .createQueryBuilder()
        .insert()
        .into(Match)
        .values({
          projectId: project.id,
          vendorId: vendor.id,
          score,
        })
        .orUpdate(['score'], ['projectId', 'vendorId']) // upsert based on unique keys
        .execute();

      return {
        projectId,
        vendorId: vendor.id,
        score,
      };
    }
  }
}
