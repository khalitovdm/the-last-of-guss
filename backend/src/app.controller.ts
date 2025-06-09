import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ 
    status: 200,
    description: 'API is running',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        version: { type: 'string', example: '1.0.0' },
      },
    },
  })
  healthCheck() {
    return {
      status: 'ok',
      version: '1.0.0',
    };
  }
} 