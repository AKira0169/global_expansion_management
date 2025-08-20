import { IsString, IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateResearchDocumentDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
