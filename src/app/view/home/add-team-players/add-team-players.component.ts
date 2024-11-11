import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Data } from 'src/app/models/data';

@Component({
  selector: 'app-add-team-players',
  templateUrl: './add-team-players.component.html',
  styleUrls: ['./add-team-players.component.scss'],
})
export class AddTeamPlayersComponent implements OnInit, OnDestroy {

  teamName!: string;
  backUrl: string = "/home/create-new-match";
  allPlayersList: any;
  selectedTeamPlayerList: any = [];
  constructor(private activatedRoute: ActivatedRoute, public data: Data) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.teamName = params.teamName,
      this.initiaizePlayerList();
    })
  }

  initiaizePlayerList() {
    this.allPlayersList = JSON.parse(JSON.stringify(this.data.allPlayersList));
    if(this.teamName === 'Team A') {
      this.selectedTeamPlayerList = JSON.parse(JSON.stringify(this.data.teamAPlayersList || []));
    } else {
      this.selectedTeamPlayerList = JSON.parse(JSON.stringify(this.data.teamBPlayersList || []));
    }
  }

  updateAllPlayersList(id: string,isSelected: boolean,teamName: string) {
    this.allPlayersList.forEach((player: any) => {
      if(player.id === id) {
        player.isSelected = isSelected;
        player.teamName = teamName
      }
    })
  }

  addPlayerInTeam(player: any) {
    this.selectedTeamPlayerList.push(player);
    this.updateAllPlayersList(player.id,true,this.teamName)
  }

  removePlayerFromTeam(player: any,index: number) {
    this.selectedTeamPlayerList.splice(index,1)
    this.updateAllPlayersList(player.id,false,"")
  }

  onPlayerSelectionCompleted() {
    this.data.allPlayersList = this.allPlayersList;
    if(this.teamName === 'Team A') {
      this.data.teamAPlayersList = this.selectedTeamPlayerList;
    } else {
      this.data.teamBPlayersList = this.selectedTeamPlayerList;
    }
  }

  ngOnDestroy(): void {
  }
}