import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateHackathonDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString({}, { message: 'startDate must be a valid ISO date string' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'endDate must be a valid ISO date string' })
  endDate?: string;

  @IsOptional()
  @IsInt({ message: 'maxParticipants must be an integer' })
  @Min(1, { message: 'maxParticipants must be at least 1' })
  maxParticipants?: number;
}
