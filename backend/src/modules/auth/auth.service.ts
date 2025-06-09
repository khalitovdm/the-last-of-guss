import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@domain/entities/user.entity';
import { UsersService } from '@modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async smartLogin(username: string, pass: string): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findOne(username);

    if (user) {
      // Пользователь существует, проверяем пароль
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        const { password, ...result } = user;
        return result;
      } else {
        throw new UnauthorizedException('Неверный пароль');
      }
    } else {
      // Пользователя нет, создаем нового
      const newUser = await this.usersService.create({ username, password: pass });
      const { password, ...result } = newUser;
      return result;
    }
  }

  async login(user: Omit<User, 'password'>) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
} 