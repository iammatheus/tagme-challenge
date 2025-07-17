import { Component, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { IProductItem } from '../../../../../core/interfaces/IProduct';
import { MatCardModule } from '@angular/material/card';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { ProductService } from '../../services/product.service';
import { of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmProductDeleteComponent } from '../confirm-product-delete/confirm.product.delete';
import { ProductModalComponent } from '../product-modal/product-modal';

@Component({
  selector: 'product-table',
  templateUrl: './product-table.html',
  imports: [
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    AsyncPipe,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  styleUrl: './styles.scss',
})
export class ProductTableComponent {
  data$ = of<IProductItem[]>([]);
  displayedColumns = ['name', 'description', 'image', 'actions'];
  totalItems = 0;
  pageSize = 5;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private productService: ProductService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getProductList(1, this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.getProductList(event.pageIndex + 1, event.pageSize);
  }

  getProductList(pageIndex: number, pageSize: number): void {
    this.productService.get(pageIndex, pageSize).subscribe({
      next: (res) => {
        this.totalItems = res.items;
        this.data$ = of(res.data);
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
    });
  }

  openProductEditModal(product: IProductItem) {
    this.matDialog.open(ProductModalComponent, {
      width: '600px',
      data: product,
    });
  }

  openProductDeleteModal(productId: number, productName: string) {
    this.matDialog.open(ConfirmProductDeleteComponent, {
      width: '600px',
      data: { productId, productName },
    });
  }
}
