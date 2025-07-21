import { effect, inject, Injectable, signal } from '@angular/core';
import { ProductService } from '../services/product.service';
import { IProduct, IProductItem } from '../../../../core/interfaces/IProduct';

@Injectable({ providedIn: 'root' })
export class ProductStore {
  private initialState = {
    data: [],
    items: 0,
    pages: 0,
    prev: 0,
  };

  private productService = inject(ProductService);
  private cache = new Map<string, IProduct>();
  private pageIndex = signal<number>(1);
  private pageSize = signal<number>(5);

  loading = signal<boolean>(false);
  products = signal<IProduct>(this.initialState);

  private searchTerm = signal<string>('');

  private buildCacheKey(page: number, size: number): string {
    return `page=${page}&size=${size}`;
  }

  setSearchTerm(term: string) {
    this.searchTerm.set(term);
    this.cache.clear();
    this.setPage(1);
  }

  readonly loadProductsEffect = effect(() => {
    const page = this.pageIndex();
    const size = this.pageSize();
    const term = this.searchTerm();

    const cacheKey = this.buildCacheKey(page, size);
    const cached = this.cache.get(cacheKey);

    if (cached) {
      this.products.set(cached);
      return;
    }

    this.loading.set(true);
    this.productService.get(page, size, term).subscribe({
      next: (response) => {
        this.products.set(response);
        this.cache.set(cacheKey, response);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  });

  setPage(page: number) {
    this.pageIndex.set(page);
  }

  setPageSize(size: number) {
    this.pageSize.set(size);
  }

  add(product: IProductItem) {
    this.loading.set(true);

    this.productService.post(product).subscribe({
      next: (created) => {
        const page = this.pageIndex();
        const size = this.pageSize();
        const cacheKey = this.buildCacheKey(page, size);

        this.products.update(({ data, items, pages, prev }) => ({
          data: [created, ...data],
          items: items + 1,
          pages,
          prev,
        }));

        const cached = this.cache.get(cacheKey);
        if (cached) {
          const updatedCache = {
            ...cached,
            data: [created, ...cached.data],
            items: cached.items + 1,
          };
          this.cache.set(cacheKey, updatedCache);
        }

        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  remove(id: string) {
    this.productService.delete(id).subscribe({
      next: () => {
        const page = this.pageIndex();
        const size = this.pageSize();
        const cacheKey = this.buildCacheKey(page, size);

        this.products.update((res) => {
          const filteredProducts = res.data.filter(
            (product) => product.id !== id
          );

          if (filteredProducts.length === 0) {
            this.cache.clear();
            this.setPage(1);
          } else {
            const cached = this.cache.get(cacheKey);
            if (cached) {
              const updatedCache = {
                ...cached,
                data: filteredProducts,
                items: cached.items - 1,
              };
              this.cache.set(cacheKey, updatedCache);
            }
          }

          return {
            data: filteredProducts,
            items: res.items - 1,
            pages: res.pages,
            prev: res.prev,
          };
        });
      },
      error: () => {
        // Em caso de erro, mostrar um toast
      },
    });
  }

  update(product: IProductItem) {
    this.loading.set(true);

    this.productService.put(product).subscribe({
      next: (updated) => {
        this.products.update((res) => {
          const updatedList = res.data.map((p) =>
            p.id === updated.id ? updated : p
          );
          return {
            ...res,
            data: updatedList,
          };
        });

        const page = this.pageIndex();
        const size = this.pageSize();
        const cacheKey = this.buildCacheKey(page, size);
        const cached = this.cache.get(cacheKey);

        if (cached) {
          const updatedCache = {
            ...cached,
            data: cached.data.map((p) => (p.id === updated.id ? updated : p)),
          };
          this.cache.set(cacheKey, updatedCache);
        }

        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
