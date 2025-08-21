import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email',
    example: 'example@example.com',
    maxLength: 50,
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
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
