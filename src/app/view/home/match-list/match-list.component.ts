import { Component, OnInit } from '@angular/core';
import { Data } from 'src/app/models/data';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss'],
})
export class MatchListComponent  implements OnInit {

  pageTitle: string = "Matches";
  newMatchLabel: string = "Start New Match";
  matchCardList: any;

  constructor(
    public data: Data,
    public firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    this.data.isMatchPlayed = false;
    this.getMatchCardList()
  }

  getMatchCardList() {
    this.firebaseService.getMatchCardList().subscribe({
      next: (matchCardList: any) => {
        this.matchCardList = matchCardList
      }
    })
  }
}
