import { effect, inject, Injectable, signal } from '@angular/core';
import { ProductService } from '../services/product.service';
import { IProduct, IProductItem } from '../../../../core/interfaces/IProduct';
import { ToastService } from '../../../shared/toast/toast.service';
import { catchError, finalize, map, Observable, of, tap } from 'rxjs';
import { PRODUCT_MESSAGES } from '../../../constants/product-messages';

@Injectable({ providedIn: 'root' })
export class ProductStore {
  private readonly productService = inject(ProductService);
  private readonly toastService = inject(ToastService);

  private readonly initialState: IProduct = {
    data: [],
    items: 0,
    pages: 0,
    prev: 0,
  };

  private readonly cache = new Map<string, IProduct>();
  private readonly pageIndex = signal<number>(1);
  private readonly pageSize = signal<number>(5);
  private readonly searchTerm = signal<string>('');

  readonly loading = signal<boolean>(false);
  readonly products = signal<IProduct>(this.initialState);
  readonly createdProduct = signal<IProductItem | null>(null);

  constructor() {
    effect(this.loadProductsEffect.bind(this));
    effect(this.handleCreatedProduct.bind(this));
  }

  private buildCacheKey(page: number, size: number): string {
    return `page=${page}&size=${size}`;
  }

  setSearchTerm(term: string) {
    this.searchTerm.set(term);
    this.cache.clear();
    this.setPage(1);
  }

  private loadProductsEffect() {
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
    this.productService
      .get(page, size, term)
      .pipe(
        tap((response) => {
          this.products.set(response);
          this.cache.set(cacheKey, response);
        }),
        catchError(() => {
          this.toastService.show(PRODUCT_MESSAGES.loadError, 'danger');
          return of(null);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe();
  }

  private handleCreatedProduct() {
    const created = this.createdProduct();
    if (!created) return;

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
      this.cache.set(cacheKey, {
        ...cached,
        data: [created, ...cached.data],
        items: cached.items + 1,
      });
    }

    this.toastService.show(PRODUCT_MESSAGES.createSuccess, 'success');
    this.createdProduct.set(null);
  }

  setPage(page: number) {
    this.pageIndex.set(page);
  }

  setPageSize(size: number) {
    this.pageSize.set(size);
  }

  add(product: IProductItem): Observable<boolean> {
    this.loading.set(true);

    return this.productService.post(product).pipe(
      tap((created) => this.createdProduct.set(created)),
      map(() => true),
      catchError(() => {
        this.toastService.show(PRODUCT_MESSAGES.createError, 'danger');
        return of(false);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  remove(id: string): Observable<boolean> {
    this.loading.set(true);

    return this.productService.delete(id).pipe(
      tap(() => {
        const page = this.pageIndex();
        const size = this.pageSize();
        const cacheKey = this.buildCacheKey(page, size);

        this.products.update((res) => {
          const filteredProducts = res.data.filter((p) => p.id !== id);

          if (filteredProducts.length === 0) {
            this.cache.clear();
            this.setPage(1);
          } else {
            const cached = this.cache.get(cacheKey);
            if (cached) {
              this.cache.set(cacheKey, {
                ...cached,
                data: filteredProducts,
                items: cached.items - 1,
              });
            }
          }

          this.toastService.show(PRODUCT_MESSAGES.deleteSuccess, 'success');

          return {
            ...res,
            data: filteredProducts,
            items: res.items - 1,
          };
        });
      }),
      map(() => true),
      catchError(() => {
        this.toastService.show(PRODUCT_MESSAGES.deleteError, 'danger');
        return of(false);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  update(product: IProductItem): Observable<boolean> {
    this.loading.set(true);

    return this.productService.put(product).pipe(
      tap((updated) => {
        this.products.update((res) => ({
          ...res,
          data: res.data.map((p) => (p.id === updated.id ? updated : p)),
        }));

        const page = this.pageIndex();
        const size = this.pageSize();
        const cacheKey = this.buildCacheKey(page, size);
        const cached = this.cache.get(cacheKey);

        if (cached) {
          this.cache.set(cacheKey, {
            ...cached,
            data: cached.data.map((p) => (p.id === updated.id ? updated : p)),
          });
        }

        this.toastService.show(PRODUCT_MESSAGES.updateSuccess, 'success');
      }),
      map(() => true),
      catchError(() => {
        this.toastService.show(PRODUCT_MESSAGES.updateError, 'danger');
        return of(false);
      }),
      finalize(() => this.loading.set(false))
    );
  }
}
