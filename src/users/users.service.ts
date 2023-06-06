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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
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

    await this.usersRepository.create({ name, email, password });
  }

  async login(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { email, deletedAt: null },
      select: ['id', 'password'],
    });
    if (!user) {
      throw new NotFoundException(`User not found.`);
    }

    if (user.password !== password) {
      throw new UnauthorizedException(`User password is not correct`);
    }

    const payload = { id: user.id };

    const accessToken = this.jwtService.signAsync(payload);

    return accessToken;
  }
}
