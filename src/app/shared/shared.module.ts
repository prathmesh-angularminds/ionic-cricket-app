import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from './back-button/back-button.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BackButtonComponent,
  ],
  exports: [BackButtonComponent]
})
export class SharedModule { }
