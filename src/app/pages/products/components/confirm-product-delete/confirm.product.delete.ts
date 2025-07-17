import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'confirm-product-delete',
  templateUrl: './confirm.product.delete.html',
  imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmProductDeleteComponent {
  readonly dialog = inject(MatDialog);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { productId: number; productName: string },
    private productService: ProductService
  ) {}

  deleteProduct() {
    this.productService.delete(this.data.productId).subscribe({
      next: () => {
        console.log('deletado');
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
    });
  }
}
