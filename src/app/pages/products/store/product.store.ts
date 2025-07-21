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
  private cache = new Map<number, IProduct>();
  private pageIndex = signal<number>(1);
  private pageSize = signal<number>(5);

  loading = signal<boolean>(false);
  products = signal<IProduct>(this.initialState);

  readonly loadProductsEffect = effect(() => {
    const page = this.pageIndex();
    const size = this.pageSize();
    const cached = this.cache.get(page);

    if (cached) {
      this.products.set(cached);
      return;
    }

    this.loading.set(true);
    this.productService.get(page, size).subscribe({
      next: (response) => {
        this.products.set(response);
        this.cache.set(page, response);
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
        this.products.update(({ data, items, pages, prev }) => {
          return {
            data: [...data, created],
            items: items + 1,
            pages: pages,
            prev: prev,
          };
        });

        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  remove(id: string) {
    this.productService.delete(id).subscribe({
      next: () => {
        this.products.update((res) => {
          const filteredProducts = res.data.filter(
            (product) => product.id !== id
          );

          if (filteredProducts.length === 0) {
            this.cache.clear();
            this.setPage(1);
          }

          return {
            data: filteredProducts,
            items: res.items - 1,
            pages: res.pages,
            prev: res.prev,
          };
        });
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

        const currentPage = this.pageIndex();
        const cached = this.cache.get(currentPage);
        if (cached) {
          const updatedCache = {
            ...cached,
            data: cached.data.map((p) => (p.id === updated.id ? updated : p)),
          };
          this.cache.set(currentPage, updatedCache);
        }

        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
