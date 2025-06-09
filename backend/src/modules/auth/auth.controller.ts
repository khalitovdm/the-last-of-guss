import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ 
    summary: 'Login or Register',
    description: 'Authenticates a user. If the user does not exist, a new one is created.'
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 201,
    description: 'Login or registration successful',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'JWT token for authentication',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid password' })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
} 