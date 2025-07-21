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
  }

  onSearch($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
  }
}
