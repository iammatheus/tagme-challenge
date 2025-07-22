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
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

import { v4 as uuidv4 } from 'uuid';
import { ProductStore } from '../../store/product.store';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    ImageCropperComponent,
    MatIcon,
    MatTooltip,
    MatProgressSpinnerModule,
  ],
  styleUrl: './styles.scss',
})
export class ProductModalComponent {
  productStore = inject(ProductStore);

  form!: FormGroup;
  products!: Signal<IProduct>;
  invalidImage: boolean = false;
  readonly loading = this.productStore.loading;

  imageChangedEvent: Event | null = null;
  croppedImage: string = '';
  productImage: string = '';

  constructor(
    private dialogRef: MatDialogRef<ProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: IProductItem
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(this.data?.name || '', [Validators.required]),
      description: new FormControl(this.data?.description || '', [
        Validators.required,
      ]),
      image: new FormControl(''),
    });

    this.data ? (this.productImage = this.data.image) : '';
  }

  closeModal() {
    this.form.reset();
    this.dialogRef.close();
  }

  postProduct(product: IProductItem) {
    this.productStore.add(product).subscribe((success) => {
      if (success) {
        this.closeModal();
      }
    });
  }

  putProduct(product: IProductItem) {
    this.productStore.update(product).subscribe((success) => {
      if (success) {
        this.closeModal();
      }
    });
  }

  submitProduct() {
    const product: IProductItem = {
      ...this.form.value,
      id: this.data?.id ?? uuidv4(),
      image: this.croppedImage ?? '',
      createdAt: this.data?.createdAt ?? new Date(),
      updatedAt: this.data?.id ? new Date() : '',
    };

    this.data ? this.putProduct(product) : this.postProduct(product);
  }

  isImageValid(file: File) {
    const isImage = file.type.startsWith('image/');

    if (!isImage) {
      this.invalidImage = !isImage;
      return false;
    }
    this.invalidImage = false;
    return true;
  }

  convertImageToBase64(blob: Blob) {
    const reader = new FileReader();
    reader.onload = () => {
      this.croppedImage = reader.result as string;
    };
    reader.readAsDataURL(blob);
  }

  onFileChange(event: Event): void {
    if (!event) return;

    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;
    if (!this.isImageValid(file)) return;

    this.imageChangedEvent = event;
  }

  onImageCropped(event: ImageCroppedEvent) {
    const blob = event.blob;

    if (!blob) return;
    this.convertImageToBase64(blob);
  }

  removeImage() {
    this.productImage = '';
    this.croppedImage = '';
    this.imageChangedEvent = null;
  }
}
