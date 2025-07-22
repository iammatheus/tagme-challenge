import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface IToastMessage {
  message: string;
  type?: 'primary' | 'success' | 'danger' | 'warning';
  duration?: number;
  title?: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new Subject<IToastMessage>();
  toastState$ = this.toastSubject.asObservable();

  show(
    message: string,
    type: IToastMessage['type'] = 'primary',
    duration = 3000
  ) {
    this.toastSubject.next({ message, type, duration });
  }
}
