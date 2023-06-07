import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: any, res: Response, next: (error?: any) => void) {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      return next();
    }
    const { id } = this.jwtService.verify(accessToken);
    req.user = id;
    next();
  }
  catch(err) {
    throw new UnauthorizedException();
  }
}
