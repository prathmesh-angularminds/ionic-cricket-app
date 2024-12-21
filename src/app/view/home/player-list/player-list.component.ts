import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { Data } from 'src/app/models/data';
import { Player } from 'src/app/models/player.interface';
import { AppStorageService } from 'src/app/service/app-storage.service';
import { FirebaseService } from 'src/app/service/firebase.service';
// import { deepCopy } from '@angular-devkit/core';

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
    private storge: AppStorageService
  ) { }

  ngOnInit() {
    this.storge.get('playerList').subscribe({
      next: (playerList: any) => {
        if(!this.data.isMatchPlayed && playerList) {
          console.log("API not called");
          this.playerList = playerList;
          this.data.allPlayersList = playerList;
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
        this.data.allPlayersList = playerList;
        this.playerList = playerList;
        this.data.isMatchPlayed = false;
        this.storge.set('playerList',playerList);
        this.storge.set('isMatchPlayed',false);
      },
      error: (e) => {console.log(e)},
    })
  }

  searchForAPlayer() {
    return this.data.allPlayersList.filter((player: Player) => player.fullName.toLocaleLowerCase().includes(this.searchText))
  }

  onPlayerSearched() {
    this.searchText = this.searchText.trim().toLocaleLowerCase();
    if(this.searchText) {
      this.playerList = this.searchForAPlayer();
    }
  }

  emptySearchedText() {
    this.playerList = this.data.allPlayersList;
    this.searchText = "";
  }
}
