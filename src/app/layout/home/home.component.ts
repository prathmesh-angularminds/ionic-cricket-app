import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit {

  playersButton: boolean = false;
  matchesButton: boolean = true;
  constructor() { }

  ngOnInit() {}

  setActiveNavbarButton(label: string) {
    if(label === 'players') {
      this.playersButton = true;
      this.matchesButton = false;
    } else {
      this.playersButton = false;
      this.matchesButton = true;
    }
  }

}
