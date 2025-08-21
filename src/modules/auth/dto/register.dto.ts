import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEmail,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Name',
    example: 'John Doe',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Email',
    example: 'example@example.com',
    maxLength: 50,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password',
    example: '12345678',
    minLength: 4,
    maxLength: 20,
  })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  password: string;
}
