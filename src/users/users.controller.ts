import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { RegistorDto } from './dto/registor.dto';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  async registor(
    @Body() { name, email, password, confirm }: RegistorDto,
    @Res() res,
  ) {
    const token = await this.usersService.registor(name, email, password);

    res.cookie('accessToken', token);

    return res.json(true);
  }

  @Post('/login')
  async login(@Body() { email, password }: LoginDto, @Res() res) {
    const token = await this.usersService.login(email, password);

    res.cookie('accessToken', token);

    return res.status(200).json(true);
  }

  @Get('/logout')
  async logout(@Res() res) {
    await res.clearCookie('accessToken');
    return res.status(200).json(true);
  }

  @Get('/mypage')
  async myArticles(@Req() req: Request) {
    const cookie = req.cookies['accessToken'];
    return await this.usersService.myArticles(cookie);
  }
}
