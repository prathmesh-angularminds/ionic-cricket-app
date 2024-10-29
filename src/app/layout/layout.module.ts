import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { RouterLink, RouterOutlet } from '@angular/router';



@NgModule({
  declarations: [HomeComponent,AuthComponent],
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink
  ]
})
export class LayoutModule { }
