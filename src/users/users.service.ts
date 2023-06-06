import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async registor(name: string, email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { email, deletedAt: null },
      select: ['id'],
    });

    if (user) {
      throw new HttpException('This email is already', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const makeUser = await this.usersRepository.insert({
      name,
      email,
      password: hashedPassword,
    });

    const payload = { id: makeUser.identifiers[0].id };

    const accessToken = this.jwtService.signAsync(payload);

    return accessToken;
  }

  async login(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { email, deletedAt: null },
      select: ['id', 'password'],
    });

    if (!user) {
      throw new NotFoundException(`User not found.`);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException(`User password is not correct`);
    }

    const payload = { id: user.id };

    const accessToken = this.jwtService.signAsync(payload);

    return accessToken;
  }

  async myArticles(cookie) {
    const { id } = await this.jwtService.verify(cookie);

    return await this.usersRepository.userArticles(id);
  }
}
