import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../../../environments/environment.local';
import { IProduct } from '../../../../core/interfaces/IProduct';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly API = env.API_URL;

  constructor(private http: HttpClient) {}

  get(page: number, limit: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.API}/products`, {
      params: {
        _per_page: limit,
        _page: page,
      },
    });
  }
}
