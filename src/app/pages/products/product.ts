import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { ProductModalComponent } from './components/product-modal/product-modal';
import { ProductTableComponent } from './components/product-table/product-table';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'product',
  templateUrl: './product.html',
  imports: [
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    ProductTableComponent,
  ],
})
export class ProductComponent {
  readonly dialog = inject(MatDialog);
  openDialog() {
    this.dialog.open(ProductModalComponent, {
      width: '600px',
    });
  }
}
