import { IsString, IsOptional, IsDate, IsNotEmpty, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoundDto {
  @ApiPropertyOptional({ description: 'Optional name for the round' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Start time of the round', required: false })
  @ValidateIf((o) => !o.useDefaultTiming)
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startsAt?: Date;

  @ApiProperty({ description: 'End time of the round', required: false })
  @ValidateIf((o) => !o.useDefaultTiming)
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endsAt?: Date;

  @ApiPropertyOptional({ 
    description: 'If true, start and end times will be calculated automatically based on configuration',
    default: false
  })
  @IsOptional()
  @Type(() => Boolean)
  useDefaultTiming?: boolean;
} 