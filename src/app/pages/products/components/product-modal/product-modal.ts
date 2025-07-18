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

import { v4 as uuidv4 } from 'uuid';
import { Store } from '@ngrx/store';
import { postProduct } from '../../../../../store/actions/product.actions';
import { Observable } from 'rxjs';
import { selectProductError } from '../../../../../store/selectors/product.selectors';
import { IAppState } from '../../../../../store/store.state';

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
  $error: Observable<string> = new Observable();

  constructor(
    private productService: ProductService,
    private dialogRef: MatDialogRef<ProductModalComponent>,
    private store: Store<IAppState>,
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

    this.$error = this.store.select(selectProductError);
  }

  closeModal() {
    this.form.reset();
    this.dialogRef.close();
  }

  postProduct(product: IProductItem) {
    this.store.dispatch(postProduct({ product }));
    this.closeModal();
  }

  submitProduct() {
    const product: IProductItem = {
      ...this.form.value,
      id: this.data?.id ?? uuidv4(),
    };

    this.data ? this.productService.put(product) : this.postProduct(product);
  }
}
