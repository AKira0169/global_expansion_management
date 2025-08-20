import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { ProjectsModule } from '../projects/projects.module';
import { EmailModule } from '../email/email.module';
import { MatchesCornJob } from './matches.cornjobs';

@Module({
  imports: [TypeOrmModule.forFeature([Match]), ProjectsModule, EmailModule],
  controllers: [MatchesController],
  providers: [MatchesService, MatchesCornJob],
})
export class MatchesModule {}
