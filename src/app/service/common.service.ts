import { Injectable } from '@angular/core';
import { Data } from '../models/data';
import { Player } from '../models/player.interface';
import { AppStorageService } from './app-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(public data: Data, public storage: AppStorageService) { }

  initDataValues() {
    this.storage.get('playerList').subscribe({
      next: (playerList: Player[]) => {
        this.data.playerList = playerList;
        this.data.teamPlayerList = JSON.parse(JSON.stringify(this.data.playerList));
        this.data.teamPlayerList.forEach((player: any) => {
          player.isSelected = false;
          player.teamName = "";
        })
      }
    })
    this.data.overs = 0;
    this.data.teamAPlayersList = [];
    this.data.teamBPlayersList = [];
  }

  setPlayerListData(playerList: Player[]) {
    playerList = JSON.parse(JSON.stringify(playerList));
    playerList.forEach((player: Player) => {
      player.isSelected = false;
      player.teamName = ""
    })
    return playerList;
  }

  initializeEmptyBatsmanObject(isOnStrike: boolean) {
    return {
      id: "",
      fullName: "",
      firstName: "",
      lastName: "",
      run: 0,
      ball: 0,
      six: 0,
      four: 0,
      strikeRate: 0,
      isOnStrike,
      isOnCrease: false,
      isPlayerOut: false,
      isSelectedForRunOut: false,
      isSelectedForRD: false
    }
  }

  initializeEmptyBowlerObject() {
    return {
      firstName: "",
      lastName: "",
      over: 0,
      run: 0,
      legalDeliveryCount: 0,
      wicket: 0,
      economy: 0,
      isCurrentBowler: false,
      balls: []
    }
  }

  updatePlayersObject(playerList: any) {
    return playerList.map((player: any) => {
      player.battingStats = {
        run: 0,
        ball: 0,
        six: 0,
        four: 0,
        isPlayerOut: false,
        isOnCrease: false,
      }
      player.bowlingStats = {
        over: 0,
        wicket: 0,
        run: 0,
      }
      player.fieldingStats = {
        totalCatch: 0,
        catchTaken: 0,
        catchDroped: 0,
        runOutAttempt: 0,
      }
      player.isPlayerSelected = false;
      player.isSelectedForBatting = false;
      player.isSelectedForBowing = false;
      player.isSelectedForFielding = false;
      return player
    })
  }

  returnNewBatsmanObjectOnSelected(batsman: any) {
    return {
      id: batsman.id,
      fullName: batsman.fullName,
      firstName: batsman.firstName,
      lastName: batsman.lastName,
      run: batsman.battingStats.run,
      ball: batsman.battingStats.ball,
      six: batsman.battingStats.six,
      four: batsman.battingStats.four,
      isPlayerOut: false,
      strikeRate: 0,
      isOnCrease: true,
    }
  }

  returnNewBowlerObjectOnSelected(bowler: any) {
    return {
      id: bowler.id,
      firstName: bowler.firstName,
      lastName: bowler.lastName,
      run: bowler.bowlingStats.run,
      over: bowler.bowlingStats.over,
      legalDeliveryCount: 0,
      wicket: bowler.bowlingStats.wicket,
      economy: bowler.bowlingStats.economy,
      isCurrentBowler: true,
      ball: []
    }
  }

  initMatchObject(inningNumber: number,battingTeam: string) {
    return {
      date: new Date(),
      matchNumberOfTheDay: 1,
      tossWinningTeam: this.data.tossWinningTeam,
      totalNumberOfOver: this.data.overs,
      inning: [this.addNewInningObject(1,battingTeam)],
      hasStartedSecondInning: false,
    }
  }

  getNumberSuffix(inningNumber: number) {
    let data = inningNumber % 10;
    if(data === 1) return 'st';  
    else if(data === 2) return 'nd';
    else if(data === 3) return 'rd';
    else return 'th'
  }

  addNewInningObject(inningNumber: number,battingTeam: string) {
    return {
      title: inningNumber + this.getNumberSuffix(inningNumber),
      battingTeam: battingTeam,
      extraRuns: {
        wide: 0,
        noBall: 0
      },
      bowlerList: [],
      batsmanList: [],
      currentRunRate: 0,
      over: 0,
      totalBowlsToBowl: 0,
      totalWicketsFallen: 0,
      totalRunScored: 0,
      isAllOut: false
    }
  }
}
