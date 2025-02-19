import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}

  async findById(id: number): Promise<Users | null> {
    return this.userRepository.findOneBy({ id });
  }

  async findByName(username: string): Promise<Users | null> {
    return this.userRepository.findOneBy({ username });
  }
}
