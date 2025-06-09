import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Username for authentication',
    example: 'player1',
    minLength: 3
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    minLength: 6,
    writeOnly: true
  })
  @IsString()
  @IsNotEmpty()
  password: string;
} 