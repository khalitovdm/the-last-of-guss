import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TapDto {
  @ApiProperty({ description: 'ID of the round to tap in', format: 'uuid' })
  @IsUUID()
  roundId: string;
} 