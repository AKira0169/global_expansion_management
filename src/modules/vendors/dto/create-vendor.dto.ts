import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateVendorDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsString({ each: true })
  countries_supported: string[];
  @IsNotEmpty()
  @IsString({ each: true })
  services_offered: string[];
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;
  @IsNotEmpty()
  @IsNumber()
  response_sla_hours: number;
}
