import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  
  constructor(private activatedRoute: ActivatedRoute, private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe({
      next: (param: any) => {
        this.getPlayerData(param.id);
      },
      error: () => {},
      complete: () => {}
    })
  }

  getPlayerData(id: string) {
    this.firebaseService.getPlayerById(id).subscribe((player: Player) => {
      this.player = player;
      this.calculateBattingAverage();
      this.calculateBowlingAverage();
      this.calculateFieldingAverage();
    });
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
