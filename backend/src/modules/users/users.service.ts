import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '@domain/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async create(createUserDto: { username: string; password: string }): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const lowerCaseUsername = createUserDto.username.toLowerCase();

    let role = UserRole.SURVIVOR;
    if (lowerCaseUsername === 'admin') {
      role = UserRole.ADMIN;
    } else if (lowerCaseUsername === 'никита') {
      role = UserRole.NIKITA;
    }

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role,
    });

    return this.usersRepository.save(user);
  }
} 