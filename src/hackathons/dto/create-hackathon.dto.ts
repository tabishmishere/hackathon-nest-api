import { IsDateString, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateHackathonDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsDateString({}, { message: 'startDate must be a valid ISO date string' })
  startDate: string;

  @IsDateString({}, { message: 'endDate must be a valid ISO date string' })
  endDate: string;

  @IsInt({ message: 'maxParticipants must be an integer' })
  @Min(1, { message: 'maxParticipants must be at least 1' })
  maxParticipants: number;
}
