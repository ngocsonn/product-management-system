import { Injectable } from '@nestjs/common';
import { Liking, Prisma, Product } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ProductDto, ProductListDto } from './product.dto';
import { CacheService } from 'src/cache/cache.service';
import { IProductDataCache } from 'src/cache/cache.interface';
import { IProductLikeRequest } from './product.interface';

const includeQuery: Prisma.ProductFindManyArgs = {
  include: {
    _count: {
      select: {
        likings: {
          where: {
            status: true,
          },
        },
      },
    },
  },
};

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async create(data: ProductDto): Promise<Product> {
    const product = await this.prisma.product.create({ data });
    const products = await this.prisma.product.findMany();
    // update cache
    this.cache.set(products);
    return product;
  }

  async like(data: IProductLikeRequest): Promise<Product> {
    const { userId, productId } = data;
    const productLike = await this.prisma.liking.findFirst({
      where: { userId, productId },
    });
    const liking = await this.prisma.liking.upsert({
      where: {
        likeId: {
          productId,
          userId,
        },
      },
      create: {
        productId,
        userId,
        status: true,
      },
      update: {
        status: !productLike?.status,
      },
      select: {
        product: true,
      },
    });
    const products = await this.prisma.product.findMany(includeQuery);
    // update cache
    this.cache.set(products);
    return liking.product;
  }

  async findAll(query?: ProductListDto): Promise<IProductDataCache[]> {
    if (this.cache.isExpired()) {
      this.cache.set(await this.prisma.product.findMany(includeQuery));
    }
    return this.cache.getPage(query);
  }
  async search(keyword: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        name: {
          contains: keyword,
        },
      },
      ...includeQuery,
    });
  }
}
