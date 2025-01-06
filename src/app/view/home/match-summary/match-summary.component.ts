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

  showCard: number = 0;
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
    this.data.matchId.subscribe((id: string) => {
      this.getMatchData(id);
    })
    // this.activatedRoute.queryParams.subscribe({
    //   next: (param: any) => {
    //   }
    // })
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
