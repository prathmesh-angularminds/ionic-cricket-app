import { Injectable } from '@angular/core';
import { Data } from '../models/data';
import { Player } from '../models/player.interface';
import { AppStorageService } from './app-storage.service';
import { increment } from '@angular/fire/firestore';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    public data: Data, 
    public storage: AppStorageService,
    public firebaseService: FirebaseService
  ) { }

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
      ball: []
    }
  }

  updatePlayersObject(playerList: any) {
    return playerList.map((player: any) => {
      player.battingDetails = {
        run: 0,
        ball: 0,
        six: 0,
        four: 0,
        isPlayerOut: false,
        isOnCrease: false,
        strikeRate: 0,
      }
      player.bowlingDetails = {
        over: 0,
        wicket: 0,
        run: 0,
        economy: 0
      }
      player.fieldingDetails = {
        catch: 0,
        catchTaken: 0,
        catchDroped: 0,
        runOutAttempt: 0,
      }
      player.hasBatted = false;
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
      run: batsman.battingDetails.run,
      ball: batsman.battingDetails.ball,
      six: batsman.battingDetails.six,
      four: batsman.battingDetails.four,
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
      run: bowler.bowlingDetails.run,
      over: bowler.bowlingDetails.over,
      legalDeliveryCount: 0,
      wicket: bowler.bowlingDetails.wicket,
      economy: 0,
      isCurrentBowler: true,
      ball: []
    }
  }

  initMatchObject(inningNumber: number,battingTeam: string) {
    return {
      date: new Date().toISOString(),
      afterMatchMessage: "",
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
      nonBattedPlayerList: [],
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

  addNonBattedPlayerList(battingTeamList: any) {
    let nonBattingPlayerList: string[] = [];
    battingTeamList.forEach((playerList: any) => {
      if(!playerList.hasBatted) {
        nonBattingPlayerList.push(playerList.fullName);
      }
    })
    return nonBattingPlayerList;
  }

  createMatchCard() {
    let matchCard = {
      lastMessage: this.data.match.afterMatchMessage,
      inning1: {
        battingTeamName: this.data.match.inning[0].battingTeam,
        score: this.data.match.inning[0].totalRunScored,
        wicket: this.data.match.inning[0].totalWicketsFallen,
        over: this.data.match.inning[0].over
      },
      inning2: {
        battingTeamName: this.data.match.inning[1].battingTeam,
        score: this.data.match.inning[1].totalRunScored,
        wicket: this.data.match.inning[1].totalWicketsFallen,
        over: this.data.match.inning[1].over
      }
    }
    this.data.match['matchCard'] = matchCard;
    return matchCard;
  }

  getPlayerUpdateObject(player: any) {
    let updatedPlayerObject = {
      id: player.id,
      match: increment(1),
        bowlingDetails: {
          over: increment(player.bowlingDetails.over),
          run: increment(player.bowlingDetails.run),
          wicket: increment(player.bowlingDetails.wicket),
          economy: player.bowlingDetails.economy
        },
        fieldingDetails: {
          catch: increment(player.fieldingDetails.catch),
          catchTaken: increment(player.fieldingDetails.catchTaken),
          runOutAttempt: increment(player.fieldingDetails.runOutAttempt),
        },
        battingDetails: {
          run: increment(player.battingDetails.run),
          ball: increment(player.battingDetails.ball),
          six: increment(player.battingDetails.six),
          four: increment(player.battingDetails.four),
          strikeRate: player.battingDetails.strikeRate,
          ...(player.battingDetails?.isPlayerOut && {dismissedCount: increment(1)})
        }
    }
    this.firebaseService.updatePlayer(updatedPlayerObject);
  }
}
