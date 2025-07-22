import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { IToastMessage, ToastService } from './toast.service';
import { MatIcon } from '@angular/material/icon';

interface IToastIcons {
  primary: string;
  success: string;
  danger: string;
  warning: string;
}

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrls: ['./toast.scss'],
  imports: [MatIcon],
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  toasts: IToastMessage[] = [];
  sub!: Subscription;

  toastIcons: IToastIcons = {
    primary: 'info',
    success: 'check_circle',
    danger: 'cancel',
    warning: 'warning',
  };

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.sub = this.toastService.toastState$.subscribe((toast) => {
      this.toasts.push(toast);

      const timeout = toast.duration ?? 3000;
      timer(timeout).subscribe(() => {
        this.toasts = this.toasts.filter((t) => t !== toast);
      });
    });
  }

  remove(toast: IToastMessage) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
