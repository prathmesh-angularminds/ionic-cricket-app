import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-match-summary',
  templateUrl: './match-summary.component.html',
  styleUrls: ['./match-summary.component.scss'],
})
export class MatchSummaryComponent  implements OnInit {

  screenWidth: number = 0;
  showCard: number = 1;
  constructor() { }

  ngOnInit() {
    this.screenWidth = window.innerWidth;
  }

  transformElement(num: number) {
    this.showCard = num
  }
}
