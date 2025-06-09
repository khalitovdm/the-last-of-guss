import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { RoundsService, PaginationOptions } from './rounds.service';
import { CreateRoundDto } from './dto/create-round.dto';
import { TapDto } from './dto/tap.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { User, UserRole } from '@domain/entities/user.entity';
import { Transform } from 'class-transformer';
import { IsOptional, IsInt, Min } from 'class-validator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQueryDto implements PaginationOptions {
  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    minimum: 1,
    default: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  limit?: number;
}

@ApiTags('Rounds')
@ApiBearerAuth()
@Controller('rounds')
@UseGuards(JwtAuthGuard)
export class RoundsController {
  constructor(private readonly roundsService: RoundsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new round' })
  @ApiResponse({ status: 201, description: 'Round created successfully' })
  @ApiResponse({ status: 403, description: 'Only admins can create rounds' })
  create(@Body() createRoundDto: CreateRoundDto, @CurrentUser() user: User) {
    return this.roundsService.create(createRoundDto, user);
  }

  @Post('tap')
  @ApiOperation({ summary: 'Tap in a round' })
  @ApiResponse({ status: 201, description: 'Tap registered successfully' })
  @ApiResponse({ status: 400, description: 'Round not found or not active' })
  tap(@Body() tapDto: TapDto, @CurrentUser() user: User) {
    return this.roundsService.tap(tapDto.roundId, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rounds' })
  @ApiResponse({ status: 200, description: 'List of rounds with pagination' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.roundsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get round by ID' })
  @ApiResponse({ status: 200, description: 'Round details' })
  @ApiResponse({ status: 404, description: 'Round not found' })
  findOne(@Param('id') id: string) {
    return this.roundsService.findOne(id);
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Get round status' })
  @ApiResponse({ status: 200, description: 'Round status' })
  @ApiResponse({ status: 404, description: 'Round not found' })
  getStatus(@Param('id') id: string) {
    return this.roundsService.getStatus(id);
  }
} 