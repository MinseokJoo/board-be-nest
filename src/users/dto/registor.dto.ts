import { IsString } from 'class-validator';

export class RegistorDto {
  @IsString()
  readonly email: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly password: string;
}
