import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AbilitiesGuard } from 'src/guards/abilities.guard';
import { Match } from './entities/match.entity';
import { Action } from 'src/ability/ability.factory';
import { CheckAbility } from 'src/Decorator/abilities.decorator';

@UseGuards(JwtAuthGuard, AbilitiesGuard)
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @CheckAbility({ action: Action.Read, subject: Match })
  @Get()
  findAll() {
    return this.matchesService.findAll();
  }
  @CheckAbility({ action: Action.Read, subject: Match })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchesService.findOne(id);
  }
  @CheckAbility({ action: Action.Delete, subject: Match })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchesService.remove(id);
  }
}
