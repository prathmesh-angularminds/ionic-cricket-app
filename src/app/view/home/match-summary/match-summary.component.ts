import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Data } from 'src/app/models/data';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-match-summary',
  templateUrl: './match-summary.component.html',
  styleUrls: ['./match-summary.component.scss'],
})
export class MatchSummaryComponent  implements OnInit {

  screenWidth: number = 0;
  showCard: number = 1;
  match: any;
  dropDownList: any = [
    {
      label: "Clone match",
      url: "/home/create-new-match",
      queryParam: {type: 'clone'}
    },
    {
      label: "Delete",
      url: "/home/match-list",
      queryParam: {}
    }
  ]
  constructor(
    public data: Data,
    public firebase: FirebaseService,
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    if(this.data.isMatchPlayed) {
      this.dropDownList.shift();
    }
    this.screenWidth = window.innerWidth;
    this.activatedRoute.queryParams.subscribe({
      next: (param: any) => {
        this.getMatchData('jgTt9Gtd7d5Tn1il3Yml');
      }
    })
  }

  transformElement(num: number) {
    this.showCard = num
  }

  returnPlayerHalfFirstName(firstName: string, lastName: string) {
    return firstName.charAt(0) + " " + lastName;
  }

  getMatchData(id: string) {
    this.firebase.getMatchById(id).subscribe({
      next: (match: any) => {
        this.match = match;
      }
    });
  }
}
