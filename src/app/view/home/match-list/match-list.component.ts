import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss'],
})
export class MatchListComponent  implements OnInit {

  pageTitle: string = "Matches";
  newMatchLabel: string = "Start New Match"
  constructor() { }

  ngOnInit() {}

}
