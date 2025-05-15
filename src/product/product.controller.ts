import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductDto, ProductListDto, ProductResponseDto } from './product.dto';
import { Product } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('products')
@ApiTags('Product')
@ApiBearerAuth('access-token')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @SerializeOptions({ strategy: 'excludeAll' })
  async findAll(
    @Query() query?: ProductListDto,
  ): Promise<ProductResponseDto[]> {
    const data = await this.productService.findAll(query);
    return plainToInstance(ProductResponseDto, data);
  }

  @Get('search')
  @SerializeOptions({ strategy: 'excludeAll' })
  async search(@Query('q') keyword: string): Promise<ProductResponseDto[]> {
    const data = await this.productService.search(keyword);
    return plainToInstance(ProductResponseDto, data);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: ProductDto): Promise<Product> {
    return this.productService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async like(@Param('id') id: number, @Req() request): Promise<Product> {
    return this.productService.like({
      productId: Number(id),
      userId: request.user.id,
    });
  }
}
