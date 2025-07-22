import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ProductStore } from '../../store/product.store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'confirm-product-delete',
  templateUrl: './confirm.product.delete.html',
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule],
  styleUrls: ['./styles.scss'],
})
export class ConfirmProductDeleteComponent {
  productStore = inject(ProductStore);
  readonly loading = this.productStore.loading;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { id: string; name: string },
    private dialogRef: MatDialogRef<ConfirmProductDeleteComponent>
  ) {}

  deleteProduct() {
    this.productStore.remove(this.data.id).subscribe((success) => {
      if (success) {
        this.dialogRef.close();
      }
    });
  }
}
