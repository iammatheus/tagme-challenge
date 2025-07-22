import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { ProductStore } from '../../store/product.store';
import { MatInput } from '@angular/material/input';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.html',
  imports: [
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    MatInput,
  ],
  styleUrl: './style.scss',
})
export class ProductFilterComponent {
  form!: FormGroup;
  productStore = inject(ProductStore);

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      filterName: [''],
    });

    this.form
      .get('filterName')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe((value) => this.productStore.setSearchTerm(value));
  }
}
