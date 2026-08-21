import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent {
isCorrect = false;
correctAnswer = '';
details: string[] = [];
isLastQuestion = false;
action: 'next' | 'restart' | 'home' = 'next';

constructor(private bsModalRef: BsModalRef) {}

close(): void {
  this.action = 'next';
  this.bsModalRef.hide();
}

restart(): void {
  this.action = 'restart';
  this.bsModalRef.hide();
}

goHome(): void {
  this.action = 'home';
  this.bsModalRef.hide();
}
}
