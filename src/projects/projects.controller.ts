import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UserParam } from 'src/Decorator/user-param.decorator';
import { User } from 'src/users/entities/user.entity';
import { AbilitiesGuard } from 'src/guards/abilities.guard';
import { CheckAbility } from 'src/Decorator/abilities.decorator';
import { Action, type AppAbility } from 'src/ability/ability.factory';
import { Project } from './entities/project.entity';
import { AbilityParam } from 'src/Decorator/ability-param.decorator';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @UserParam() user: User) {
    return this.projectsService.create(createProjectDto, user);
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbility({
    action: Action.Read,
    subject: Project,
  })
  @Get()
  findAll(
    @Query() query: { userIds: string },
    @UserParam() user: User,
    @AbilityParam() ability: AppAbility,
  ) {
    const { userIds } = query;

    return this.projectsService.findAll(user, userIds, ability);
  }

  @Get('user')
  findByUserId(@UserParam() user: User) {
    return this.projectsService.findByUserId(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @AbilityParam() ability: AppAbility) {
    return this.projectsService.findOne(id, ability);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
