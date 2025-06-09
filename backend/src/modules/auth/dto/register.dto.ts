import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Username for new account. Special values: "admin" for ADMIN role, "Никита" for NIKITA role',
    example: 'player1',
    minLength: 3,
    pattern: '^[a-zA-Z0-9_-]+$'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Username can only contain letters, numbers, underscores and dashes',
  })
  username: string;

  @ApiProperty({
    description: 'Password for new account',
    example: 'password123',
    minLength: 6,
    writeOnly: true
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
} 