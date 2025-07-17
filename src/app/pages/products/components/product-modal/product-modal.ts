import { Component, Inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
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
})
export class ProductModalComponent {
  form!: FormGroup;

  constructor(
    private productService: ProductService,
    private dialogRef: MatDialogRef<ProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: IProductItem
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(this.data?.name || '', [Validators.required]),
      description: new FormControl(this.data?.description || '', [
        Validators.required,
      ]),
      image: new FormControl(this.data?.image || ''),
    });
  }

  closeModal() {
    this.form.reset();
    this.dialogRef.close();
  }

  submitProduct() {
    const product: IProductItem = {
      ...this.form.value,
      id: this.data?.id ?? uuidv4(),
    };

    const request$ = this.data
      ? this.productService.put(product)
      : this.productService.post(product);

    request$.subscribe({
      next: () => this.closeModal(),
      error: (error: HttpErrorResponse) => console.error(error),
    });
  }
}
