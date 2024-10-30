import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-match-summary',
  templateUrl: './match-summary.component.html',
  styleUrls: ['./match-summary.component.scss'],
})
export class MatchSummaryComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  transformElement() {
    let element: any = document.getElementsByClassName('match-summary-first-inning')[0];
    element.style.transform = 'translateX(-390px)'
    console.log(element.style)
  }
}
