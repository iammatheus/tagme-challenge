import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IProductItem } from '../../../../../core/interfaces/IProduct';
import { ProductService } from '../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';

import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'product-modal',
  templateUrl: './product-modal.html',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatLabel,
    MatFormField,
    MatInputModule,
    MatError,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductModalComponent {
  readonly dialog = inject(MatDialog);
  form!: FormGroup;
  product!: IProductItem;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      image: new FormControl(''),
    });
  }

  closeModal() {
    this.form.reset();
    this.dialog.closeAll();
  }

  postProduct() {
    this.product = this.form.value;
    this.product.id = uuidv4();

    this.productService.post(this.product).subscribe({
      next: () => {
        this.closeModal();
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
    });
  }
}
