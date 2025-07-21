import { Component, inject, Inject, Signal } from '@angular/core';
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
import {
  IProduct,
  IProductItem,
} from '../../../../../core/interfaces/IProduct';
import { ProductService } from '../../services/product.service';

import { v4 as uuidv4 } from 'uuid';
import { Observable } from 'rxjs';
import { ProductStore } from '../../store/product.store';

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
  productStore = inject(ProductStore);

  form!: FormGroup;
  $error: Observable<string> = new Observable();
  products!: Signal<IProduct>;

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

  postProduct(product: IProductItem) {
    this.productStore.add(product);
    this.closeModal();
  }

  putProduct(product: IProductItem) {
    this.productStore.update(product);
    this.closeModal();
  }

  submitProduct() {
    const product: IProductItem = {
      ...this.form.value,
      id: this.data?.id ?? uuidv4(),
      createdAt: this.data?.createdAt ?? new Date(),
      updatedAt: this.data?.id ? new Date() : '',
    };

    this.data ? this.putProduct(product) : this.postProduct(product);
  }
}
