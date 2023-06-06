import { Body, Controller, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { RegistorDto } from './dto/registor.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async registor(@Body() { email, name, password }: RegistorDto) {
    return;
  }

  @Post('/login')
  async login(@Body() { email, password }: LoginDto, @Res() res: Response) {
    const token = await this.usersService.login(email, password);
    res.cookie('Authentication', token, {
      domain: 'localhost',
      path: '/',
      httpOnly: true,
    });
    return;
  }
}
