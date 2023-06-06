import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { Match } from 'src/validator/match.decorator';

export class RegistorDto {
  @IsEmail()
  @IsString()
  readonly email: string;

  @MinLength(1)
  @IsString()
  readonly name: string;

  @MinLength(6)
  @MaxLength(12)
  @IsString()
  password: string;

  @Match('password', {
    message: 'The confirm password is not same as the password',
  })
  @IsString()
  readonly confirm: string;
}
