import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  message = '';
  result = new Subject<boolean>();

  constructor(private bsModalRef: BsModalRef) {}

  onYes(): void {
    this.result.next(true);
    this.bsModalRef.hide();
  }

  onNo(): void {
    this.result.next(false);
    this.bsModalRef.hide();
  }
}
