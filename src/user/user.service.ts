import { Injectable } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { Users } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}

  create(user: DeepPartial<Users>) {
    return this.userRepository.create(user);
  }

  async findById(id: number): Promise<Users | null> {
    return this.userRepository.findOneBy({ id });
  }

  async findByName(username: string): Promise<Users | null> {
    return this.userRepository.findOneBy({ username });
  }

  async updateInfo(id: number, data: Partial<Users>): Promise<void> {
    await this.userRepository.update(id, data);
  }

  async updatePassword(id: number, password: string): Promise<void> {
    await this.userRepository.update(id, { password });
  }
}
