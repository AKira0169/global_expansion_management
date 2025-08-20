import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  country: string;
  @IsString({ each: true })
  @IsNotEmpty()
  services_needed: string[];
  @IsNumber()
  @IsNotEmpty()
  budget: number;
}
