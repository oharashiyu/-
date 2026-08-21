import { Injectable } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmComponent } from './confirm/confirm.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {

  constructor(private modalService: BsModalService) { }

  show(isCorrect: boolean, correctAnswer: string, details: string[] = [], isLastQuestion = false){
     const bsModalRef = this.modalService.show(ConfirmComponent, {
    class: 'fullscreen-result-modal',
  });
    bsModalRef.content!.isCorrect = isCorrect;
    bsModalRef.content!.correctAnswer = correctAnswer;
    bsModalRef.content!.details = details;
    bsModalRef.content!.isLastQuestion = isLastQuestion;
    return bsModalRef;
  }

  confirm(message: string) {
    const bsModalRef = this.modalService.show(ConfirmDialogComponent, {
      class: 'modal-dialog-centered confirm-modal',
    });
    bsModalRef.content!.message = message;
    return bsModalRef.content!.result.asObservable();
  }
}
