import { Injectable } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  async create(createMatchDto: CreateMatchDto) {
    return this.matchRepository.save(createMatchDto);
  }

  async findAll() {
    return this.matchRepository.find({
      relations: ['project', 'vendor'],
    });
  }
  async findOne(id: string) {
    return this.matchRepository.findOne({
      where: { id },
      relations: ['project', 'vendor'],
    });
  }
  async update(id: string, updateMatchDto: UpdateMatchDto) {
    return this.matchRepository.update(id, updateMatchDto);
  }
  async remove(id: string) {
    return this.matchRepository.delete(id);
  }
}
