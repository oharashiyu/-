import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ConfirmComponent } from './confirm.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ConfirmService } from '../confirm.service';



@NgModule({
  declarations: [
    ConfirmComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    ModalModule.forRoot()
  ],
  providers:[
    ConfirmService
  ]
})
export class ConfirmModule { }
