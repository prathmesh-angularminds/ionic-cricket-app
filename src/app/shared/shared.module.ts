import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from './back-button/back-button.component';
import { DropdownComponent } from './dropdown/dropdown.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BackButtonComponent,
    DropdownComponent
  ],
  exports: [BackButtonComponent,DropdownComponent]
})
export class SharedModule { }
