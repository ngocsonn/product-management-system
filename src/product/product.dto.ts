import { ApiProperty, ApiPropertyOptional, ApiQuery } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  IsDecimal,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class ProductDto {
  @ApiProperty({
    example: 'product 01',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '100',
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: 'category 01',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: 'sub category 01',
  })
  @IsString()
  @IsNotEmpty()
  subCategory: string;
}

export class ProductListDto {
  @ApiProperty({ example: 1, minimum: 1, required: false })
  @IsNotEmpty({ message: 'page is required when limit is provided' })
  @ValidateIf((o) => o.limit !== undefined && o.limit !== null)
  page?: number;

  @ApiProperty({ example: 10, minimum: 1, required: false })
  @IsNotEmpty({ message: 'limit is required when page is provided' })
  @ValidateIf((o) => o.page !== undefined && o.page !== null)
  limit?: number;
}

export class ProductResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  price: number;

  @Expose()
  category: string;

  @Expose()
  subCategory: string;

  @Expose({ name: 'liking' })
  @Transform(({ obj }) => Number(obj._count.likings))
  liking: number;
}
