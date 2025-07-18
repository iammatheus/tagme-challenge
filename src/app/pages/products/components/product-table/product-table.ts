import { Component, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import {
  IProduct,
  IProductItem,
} from '../../../../../core/interfaces/IProduct';
import { MatCardModule } from '@angular/material/card';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmProductDeleteComponent } from '../confirm-product-delete/confirm.product.delete';
import { ProductModalComponent } from '../product-modal/product-modal';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../../store/store.state';
import { getProducts } from '../../../../../store/actions/product.actions';
import {
  selectLoading,
  selectProductList,
} from '../../../../../store/selectors/product.selectors';

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
  displayedColumns = ['name', 'description', 'image', 'actions'];
  startPageSize = 5;

  loading$: Observable<boolean> = new Observable();
  error$: Observable<string> = new Observable();
  poducts$: Observable<IProduct> = new Observable();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private matDialog: MatDialog, private store: Store<IAppState>) {}

  ngOnInit(): void {
    this.store.dispatch(getProducts({ pageIndex: 1, pageSize: 5 }));
    this.loading$ = this.store.select(selectLoading);
    this.poducts$ = this.store.select(selectProductList);
  }

  onPageChange(event: PageEvent): void {
    const { pageIndex, pageSize } = event;
    this.store.dispatch(
      getProducts({ pageIndex: pageIndex + 1, pageSize: pageSize })
    );
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
