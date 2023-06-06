import { PickType } from '@nestjs/mapped-types';
import { RegistorDto } from './registor.dto';

export class LoginDto extends PickType(RegistorDto, [
  'email',
  'password',
] as const) {}
