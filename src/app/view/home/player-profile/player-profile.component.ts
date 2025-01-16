import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Player } from 'src/app/models/player.interface';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-player-profile',
  templateUrl: './player-profile.component.html',
  styleUrls: ['./player-profile.component.scss'],
})
export class PlayerProfileComponent  implements OnInit {

  pageTitle: string = "Player Statistics";
  url: string = "/home/player-list";
  player!: any;
  dropDownList: any = [
    {
      label: "Edit player",
      url: "/home/edit-player",
      queryParam: {}
    },
    {
      label: "Reset player",
      url: "/home/player-profile",
      queryParam: {}
    },
    {
      label: "Delete player",
      url: "/home/player-profile",
      queryParam: {}
    },
  ];
  playerId: string= "";
  showDeletePlayerModal: boolean = false;
  showResetPlayerModal: boolean = false;
  shouldCallGetApi: boolean = true;
  
  constructor(
    private activatedRoute: ActivatedRoute, 
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe({
      next: (param: any) => {
        this.playerId = param.id;
        this.dropDownList[0].queryParam = {id: param.id};
        this.dropDownList[1].queryParam = {id: param.id,showResetPlayerModal: true, shouldCallGetApi: false};
        this.dropDownList[2].queryParam = {id: param.id,showDeletePlayerModal: true, shouldCallGetApi: false};
        this.showDeletePlayerModal = param?.showDeletePlayerModal || false;
        this.showResetPlayerModal = param?.showResetPlayerModal || false;
        if(this.shouldCallGetApi) {
          this.getPlayerData(param.id);
          this.shouldCallGetApi = false;
        }
      },
      error: () => {},
      complete: () => {}
    })
  }

  getPlayerData(id: string) {
    this.firebaseService.getPlayerById(id).subscribe((player: Player) => {
      if(player) {
        this.player = player;
        this.calculateBattingAverage();
        this.calculateBowlingAverage();
        this.calculateFieldingAverage();
      }
    });
  }

  deletePlayer() {
    this.firebaseService.deletePlayer(this.playerId).subscribe({
      next: () => {
        this.router.navigate(['/home/player-list'])
      }
    })
  }

  resetPlayer() {
    let player = {
      id: this.playerId,
      battingDetails: {
          four: 0,
          average: 0,
          ball: 0,
          strikeRate: 0,
          dismissedCount: 0,
          six: 0,
          run: 0
      },
      fieldingDetails: {
          catch: 0,
          runOutAttempt: 0,
          catchTaken: 0,
          fieldingAvg: 0,
          catchDroped: 0
      },
      match: 0,
      bowlingDetails: {
          run: 0,
          over: 0,
          mostWicket: 0,
          average: 0,
          wicket: 0,
          economy: 0
      }
  }
    this.firebaseService.updatePlayer(player).subscribe({
      next: () => {
        this.getPlayerData(this.playerId);
      }
    })
  }

  calculateBattingAverage() {
    this.player.bowlingDetails.average = this.player.bowlingDetails.wicket ? (this.player.bowlingDetails.run / this.player.bowlingDetails.wicket) : 0;
  }

  calculateBowlingAverage() {
    this.player.battingDetails.average = this.player.battingDetails.dismissedCount ? (this.player.battingDetails.run / this.player.battingDetails.wicket) : this.player.battingDetails.run;
  }

  calculateFieldingAverage() {
    this.player.fieldingDetails.fieldingAvg = this.player.fieldingDetails.catch ? (this.player.fieldingDetails.catchTaken / this.player.fieldingDetails.catch) * 100 : 0;
  }
}
