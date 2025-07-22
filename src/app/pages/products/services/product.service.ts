import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment as env } from '../../../../environments/environment.local';
import { IProduct, IProductItem } from '../../../../core/interfaces/IProduct';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly API_URL = env.API_URL;

  constructor(private http: HttpClient) {}

  get(page: number, itemsPerPage: number, term?: string): Observable<IProduct> {
    let params = new HttpParams()
      .set('_page', page)
      .set('_per_page', itemsPerPage);

    if (term) {
      params = params.set('name', term);
    }

    return this.http
      .get<IProduct>(`${this.API_URL}/products`, {
        params,
      })
      .pipe(take(1));
  }

  post(product: IProductItem): Observable<IProductItem> {
    return this.http
      .post<IProductItem>(`${this.API_URL}/products`, product)
      .pipe(take(1));
  }

  put(product: IProductItem): Observable<IProductItem> {
    return this.http
      .put<IProductItem>(`${this.API_URL}/products/${product.id}`, product)
      .pipe(take(1));
  }

  delete(id: string): Observable<IProductItem> {
    return this.http
      .delete<IProductItem>(`${this.API_URL}/products/${id}`)
      .pipe(take(1));
  }
}
