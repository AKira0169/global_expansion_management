import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }
  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }
  async findById(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }
  async remove(id: string) {
    return this.usersRepository.delete(id);
  }
  async findAll() {
    return this.usersRepository.find();
  }
  async findOne(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }
}
