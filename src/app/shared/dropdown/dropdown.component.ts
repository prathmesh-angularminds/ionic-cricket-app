import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  imports: [CommonModule, RouterLink],
  standalone: true
})
export class DropdownComponent  implements OnInit {

  @Input()
  dropdownList: any;
  isDropdownOpen: boolean = false; 

  constructor() { }

  ngOnInit() {}

  dropDownOpened() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

}
