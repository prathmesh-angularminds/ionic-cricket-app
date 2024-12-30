import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Data } from 'src/app/models/data';
import { Player } from 'src/app/models/player.interface';
import { AppStorageService } from 'src/app/service/app-storage.service';
import { CommonService } from 'src/app/service/common.service';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss'],
})
export class PlayerListComponent  implements OnInit {

  pageTitle: string = "Player's";
  addNewPlayerButtonLabel: string = "Add New Player";
  playerList: any = [];
  searchText: string = "";

  constructor(
    private router: Router,
    public firebaseService: FirebaseService,
    public data: Data,
    private storage: AppStorageService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.storage.get('playerList').subscribe({
      next: (playerList: any) => {
        if(!this.data.isMatchPlayed && playerList) {
          this.playerList = playerList;
          this.data.playerList = playerList;
        } else {
          this.getAllPlayers();
        }
      }
    })
  }

  viewPlayerDetails() {
    this.router.navigate(['/home/player-profile']);
  }

  getAllPlayers() {
    this.firebaseService.getPlayerList().subscribe({
      next: (playerList) => {
        this.data.playerList = playerList;
        this.playerList = this.data.playerList;
        this.data.isMatchPlayed = false;
        this.storage.set('playerList',this.data.playerList);
        this.storage.set('isMatchPlayed',false);
      },
      error: (e) => {console.log(e)},
    })
  }

  searchForAPlayer() {
    return this.data.playerList.filter((player: Player) => player.fullName.toLocaleLowerCase().includes(this.searchText))
  }

  onPlayerSearched() {
    this.searchText = this.searchText.trim().toLocaleLowerCase();
    if(this.searchText) {
      this.playerList = this.searchForAPlayer();
    }
  }

  emptySearchedText() {
    this.playerList = this.data.playerList;
    this.searchText = "";
  }
}
