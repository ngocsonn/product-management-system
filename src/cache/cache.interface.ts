import { ProductListDto } from 'src/product/product.dto';

export interface IProductDataCache {
  id: number;
  name: string;
  price: number;
  category: string;
  subCategory: string;
}

export interface ICache {
  set(products: IProductDataCache[]): void;
  getPage(query?: ProductListDto): IProductDataCache[];
  isExpired(): boolean;
  clear(): void;
}
