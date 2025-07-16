import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { ProductModalComponent } from './components/product-modal/product-modal';
import { ProductTableComponent } from './components/product-table/product-table';

@Component({
  selector: 'product',
  templateUrl: './product.html',
  imports: [
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    ProductTableComponent,
    ProductModalComponent,
  ],
})
export class ProductComponent {
  protected readonly title = 'Hello World';
}
