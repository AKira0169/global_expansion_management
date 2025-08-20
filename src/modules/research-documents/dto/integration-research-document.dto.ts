import { IsOptional, IsString, IsArray } from 'class-validator';

export class SearchResearchDocumentDto {
  @IsOptional()
  @IsString()
  textSearch?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  projectId?: string;
}
