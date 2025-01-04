import { Component, OnInit } from '@angular/core';
import { Data } from 'src/app/models/data';

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss'],
})
export class MatchListComponent  implements OnInit {

  pageTitle: string = "Matches";
  newMatchLabel: string = "Start New Match";
  constructor(public data: Data) { }

  ngOnInit() {
    this.data.isMatchPlayed = false;
  }
}
