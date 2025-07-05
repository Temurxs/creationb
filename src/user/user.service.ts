import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';



@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async findOrCreate(user: Partial<User>): Promise<User> {
    const existing = await this.userRepo.findOneBy({ id: user.id });
    if (existing) return existing;

    const newUser = this.userRepo.create(user);
    return this.userRepo.save(newUser);
  }
}
