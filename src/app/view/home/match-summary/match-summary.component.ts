import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
      url: "/home/match-summary",
      queryParam: {}
    }
  ]
  matchId: string = "";
  matchCardId: string = "";
  showDeleteMatchModal: boolean = false;
  

  constructor(
    public data: Data,
    public firebase: FirebaseService,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe({
      next: (param: any) => {
        this.dropDownList[1].queryParam = {showDeleteMatchModal: true, id: param.id,matchCardId:  param.matchCardId}
        this.matchId = param.id;
        this.matchCardId = param.matchCardId;
        this.showDeleteMatchModal = param?.showDeleteMatchModal || false;
        this.getMatchData(param.id);
      }
    })
  }

  transformElement(num: number) {
    this.showCard = num
  }

  deleteMatch() {
    this.firebase.deleteMatch(this.matchId,this.matchCardId);
    this.router.navigate(['/home/match-list']);
  }

  returnPlayerHalfFirstName(firstName: string, lastName: string) {
    return firstName + " " + lastName?.charAt(0);
  }

  getMatchData(id: string) {
    this.firebase.getMatchById(id).subscribe({
      next: (match: any) => {
        this.match = match;
      }
    });
  }
}
