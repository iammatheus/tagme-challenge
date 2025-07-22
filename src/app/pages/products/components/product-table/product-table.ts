import { Component, inject, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { IProductItem } from '../../../../../core/interfaces/IProduct';
import { MatCardModule } from '@angular/material/card';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmProductDeleteComponent } from '../confirm-product-delete/confirm.product.delete';
import { ProductModalComponent } from '../product-modal/product-modal';
import { ProductStore } from '../../store/product.store';
import { ProductFilterComponent } from '../product-filter/product-filter';

@Component({
  selector: 'product-table',
  templateUrl: './product-table.html',
  imports: [
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    ProductFilterComponent,
  ],
  styleUrl: './styles.scss',
})
export class ProductTableComponent {
  productStore = inject(ProductStore);

  displayedColumns = ['image', 'name', 'description', 'actions'];
  startPageSize = 5;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private matDialog: MatDialog) {}

  readonly products = this.productStore.products;
  readonly loading = this.productStore.loading;

  ngOnInit(): void {
    this.productStore.setPage(1);
    this.productStore.setPageSize(this.startPageSize);
  }

  onPageChange(event: PageEvent): void {
    const { pageIndex, pageSize } = event;
    this.productStore.setPage(pageIndex + 1);
    this.productStore.setPageSize(pageSize);
  }

  openProductEditModal(product: IProductItem) {
    this.matDialog.open(ProductModalComponent, {
      width: '600px',
      data: product,
    });
  }

  openProductDeleteModal({ id, name }: IProductItem) {
    this.matDialog.open(ConfirmProductDeleteComponent, {
      width: '600px',
      data: { id, name },
    });
  }
}
