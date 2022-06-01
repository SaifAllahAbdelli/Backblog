import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  Max,
  IsDateString,
  IsEnum,
  IsArray,
  IsPositive,
  IsOptional,
  isArray,
} from 'class-validator';
export enum CategoryList {
  web = 'Web',
  mobile = 'Mobile',
}
export class CreatePostDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  picture: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsArray()
  @IsEnum(CategoryList, { each: true })
  category: CategoryList[];
}
