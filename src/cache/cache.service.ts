import { Injectable } from '@nestjs/common';
import { ICache, IProductDataCache } from './cache.interface';
import { ProductListDto } from 'src/product/product.dto';

@Injectable()
export class CacheService implements ICache {
  private products: IProductDataCache[] = [];
  private ttlMs: number = process.env.TTL_MS
    ? Number(process.env.TTL_MS)
    : 10000;
  private expireAt: number = 0;

  set(products: IProductDataCache[]) {
    this.products = products;
    this.expireAt = Date.now() + this.ttlMs;
  }
  getPage(query?: ProductListDto): IProductDataCache[] {
    if (!query?.page && !query?.limit) {
      return this.products;
    }

    const start = (Number(query.page) - 1) * Number(query.limit);
    return this.products.slice(start, start + Number(query.limit));
  }
  isExpired(): boolean {
    return Date.now() > this.expireAt;
  }
  clear() {
    this.products = [];
    this.expireAt = 0;
  }
}
