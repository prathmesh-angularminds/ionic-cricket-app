import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Data } from 'src/app/models/data';
import { CommonService } from 'src/app/service/common.service';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-update-score',
  templateUrl: './update-score.component.html',
  styleUrls: ['./update-score.component.scss'],
})
export class UpdateScoreComponent implements OnInit {

  url: string = '/home/match-list';
  inning: number = 0;
  match: any = {}
  teamA: any = [];
  teamB: any = [];
  currentSelectedBatsman: any = {};
  currentSelectedBowler: any = {};
  currentSelectedFielder: any = {};
  isOnStrikeBatsmanOut: boolean = false;
  showNewBatsmanModal: boolean = false;
  showNewBowlerModal: boolean = false;
  showPlayerReturnDeclareModal: boolean = false;
  showCaughtOutModal: boolean = false;
  showRunOutModal: boolean = false;
  isInitSetup: boolean = true;
  onStrikePlayerIndex: number = 0;
  batsmanId!: string;
  scoreKeyboard: [] = []
  areAllPlayersSelected: boolean = false;
  isNewOver: boolean = false;
  currentBattingPairTable: any = {
    tableHeader: ["Batting","R","B","6s","4s","S.R"],
    battingPairList: []
  }
  currentBowlerTable: any = {
    tableHeader: ["Bowling","Ov","Runs","Wkts","Econ"],
    currentBowler: {}
  }
  changeBatsmanIndex!: number;
  currentRunOutBatsman: any = {};
  currentRunOutBatsmanIndex: number = -1;
  currentBattingTeam: string = "";
  battingTeamLength: number = 0;
  showInningCompletedScreen: boolean = false;
  target: number = 0;
  requiredRun: number = 0;
  requiredRunRate: string = '0';
  ballsLeft: number = 0;
  retieredBatsmanIndex: number = -1;
  runScoredInLastOver: number = 0;
  hasStartedInning: boolean = false;
  isOnStrikeBatsmanRunOut: boolean = false;
  bowlerObject: any;
  keyboardCell: any;

  constructor(
    public data: Data,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public commonService: CommonService,
    public firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    this.scoreKeyboard = this.data.scoreKeyboard;
    this.currentBattingTeam = this.data.tossWinningTeam;
    this.battingTeamLength = this.getCurrentBattingTeam().length;
    this.initMatchObject();
    this.initCurrentBowlersBatsmanList();
    this.teamA = this.commonService.updatePlayersObject(this.data.teamAPlayersList);
    this.teamB = this.commonService.updatePlayersObject(this.data.teamBPlayersList);
    this.activatedRoute.queryParams.subscribe({
      next: (params: any) => {
        this.showNewBatsmanModal = params?.showNewBatsmanModal;
        this.showNewBowlerModal = params?.showNewBowlerModal;
        this.showPlayerReturnDeclareModal = params?.showPlayerReturnDeclareModal;
        this.showCaughtOutModal = params.showCaughtOutModal;
        this.showRunOutModal = params.showRunOutModal;
      }
    })
  }

  initMatchObject() {
    this.match = this.commonService.initMatchObject(1,this.currentBattingTeam);
  }

  getCurrentBattingTeam() {
    if(this.currentBattingTeam.includes('TEAM A')) {
      return this.teamA;
    }
    if(this.currentBattingTeam.includes('TEAM B')) {
      return this.teamB;
    }
  }

  getCurrentBowlingTeam() {
    if(this.currentBattingTeam.includes('TEAM A')) {
      return this.teamB;
    }
    if(this.currentBattingTeam.includes('TEAM B')) {
      return this.teamA;
    }
  }

  initCurrentBowlersBatsmanList() {
    this.currentBattingPairTable.battingPairList = [this.commonService.initializeEmptyBatsmanObject(true),this.commonService.initializeEmptyBatsmanObject(false)];
    this.currentBowlerTable.currentBowler = this.commonService.initializeEmptyBowlerObject();
  }

  getCurrentBowlerProperties(key: any): any {
    return this.currentBowlerTable.currentBowler[key];
  }

  updateOver() {
    let over: string = (this.getCurrentBowlerProperties('over') + 0.1).toFixed(1);
    if(over.split('.')[1] === '6') {
      this.isNewOver = true;
      return Number(over.split('.')[0]) + 1;
    } else {
      this.isNewOver = false;
      return Number(over)
    }
  }

  updateInningOver() {
    let over: string = (this.match.inning[this.inning].over + 0.1).toFixed(1);
    if(over.split('.')[1] === '6') {
      this.match.inning[this.inning].over = Number(over.split('.')[0]) + 1;
    } else {
      this.match.inning[this.inning].over = Number(over);
    }
  }

  getBallsInOver() {
    let over = this.match.inning[this.inning].over;
    let ball = over.toString().split(".")[1] || 0;
    ball = (Number(ball) / 6);
    if(ball || Math.floor(over)) {
      return Math.floor(over) + ball
    } else {
      return 0;
    }
  }

  calculateCurrentRunRate() {
    let over = this.getBallsInOver();
    this.match.inning[this.inning].currentRunRate = over ? (this.match.inning[this.inning].totalRunScored / over).toFixed(1) : over;
  }

  calculateRequiredRunRate() {
    this.requiredRunRate = (this.requiredRun / this.ballsLeft).toFixed(1);
  }

  calculateTotalRunsScored(run: number) {
    this.match.inning[this.inning].totalRunScored += run; 
  }

  calculateBowlerEconomy(run: number) {
    let totalDeliveryBowled: number = this.getCurrentBowlerProperties('ball').length + 1;
    run = this.getCurrentBowlerProperties('run') + run
    return Math.round(run / totalDeliveryBowled);
  }

  updateCurrentBowlerList(cssClass: string, label: string, run: number, ballType: string) {
    let ball = this.getCurrentBowlerProperties('ball');
    ball.push({
      class: cssClass, label, run, ballType
    })
    return ball;
  }

  updateWideBallCount() {
    this.match.inning[this.inning].extraRuns.wide += 1;
  }

  updateNoBallCount() {
    this.match.inning[this.inning].extraRuns.noBall += 1;
  }

  onInningCompleted(teamName: string) {
    this.hasStartedInning = false;
    this.match.hasStartedSecondInning = true;
    this.match.inning[this.inning].nonBattedPlayerList = this.commonService.addNonBattedPlayerList(this.getCurrentBattingTeam());
    this.target = this.match.inning[this.inning].totalRunScored;
    this.requiredRun = this.target;
    this.inning++;
    if(this.inning === 2) {
      this.data.isMatchPlayed = true;
      this.match.afterMatchMessage = this.setAfterMatchMessage();
      this.data.match = this.match;
      this.firebaseService.addMatch(this.match);
      this.router.navigate(['/home/match-summary']);
    }
    this.ballsLeft = this.data.overs * 6;
    this.requiredRunRate = ((this.target) / (this.data.overs)).toFixed(1);
    this.match.inning.push(this.commonService.addNewInningObject(this.inning + 1,teamName))
    this.initCurrentBowlersBatsmanList();
  }

  onButtonClicked(keyboardCell: any) {
    this.runScoredInLastOver += keyboardCell.run;
    var bowlerObject: any = {
      run: this.getCurrentBowlerProperties('run') + keyboardCell.run,
      economy: this.calculateBowlerEconomy(keyboardCell.run),
    }
    if(keyboardCell.isLegalDelivery) {
      bowlerObject.legalDeliveryCount = this.getCurrentBowlerProperties('legalDeliveryCount') + 1;
      bowlerObject.over = this.updateOver();
      this.updateInningOver();
    }
    if(keyboardCell.isWicket) {
      bowlerObject.wicket = this.getCurrentBowlerProperties('wicket') + 1
    }
    this.calculateTotalRunsScored(keyboardCell.run);
    switch(keyboardCell.type) {
      // 1, 2, 3, 4, 6, 2D, 0
      case "RUN": 
        this.updateOnStrikeBatsmanScore(keyboardCell);
        bowlerObject.ball = this.updateCurrentBowlerList(keyboardCell.class,keyboardCell.run,keyboardCell.run,keyboardCell.type);
        this.updateAfterBallChanges(bowlerObject,keyboardCell);
        break;
      case "WIDE":
        this.updateWideBallCount();
        bowlerObject.ball = this.updateCurrentBowlerList(keyboardCell.class,'WD',keyboardCell.run,keyboardCell.type)
        this.updateAfterBallChanges(bowlerObject,keyboardCell);
        break;
      case "NOBALL":
        this.updateNoBallCount();
        keyboardCell.run -= 1;
        if(keyboardCell.run) {
          this.updateOnStrikeBatsmanScore(keyboardCell);
        }
        var label: string = keyboardCell.run ? keyboardCell.run + " NB" : keyboardCell.run;
        bowlerObject.ball = this.updateCurrentBowlerList(keyboardCell.class,keyboardCell.run,keyboardCell.run,keyboardCell.type)
        this.updateAfterBallChanges(bowlerObject,keyboardCell);
        break;
      // RO, 1 + RO, 2 + RO, 3 + RO, 4 + RO
      case "RUNOUT": 
        var label: string = keyboardCell.run + " RO";
        this.updateOnStrikeBatsmanScore(keyboardCell);
        this.router.navigate(['/home/update-score'],{queryParams: {showRunOutModal: true}});
        bowlerObject.ball = this.updateCurrentBowlerList(keyboardCell.class,label,keyboardCell.run,keyboardCell.type)
        this.match.inning[this.inning].totalWicketsFallen++;
        this.areAllPlayersSelected = false;
        this.bowlerObject = bowlerObject;
        this.keyboardCell = keyboardCell;
        break;
      case "WICKET": 
        this.updateBatterAfterWicket(keyboardCell.label);
        bowlerObject.ball = this.updateCurrentBowlerList(keyboardCell.class,"W",keyboardCell.run,keyboardCell.type)
        this.match.inning[this.inning].totalWicketsFallen++;
        this.updateAfterBallChanges(bowlerObject,keyboardCell);
        break;
      case "RETIRED_HURT":
        if(this.areAllPlayersSelected) {
          this.router.navigate(['/home/update-score'],{queryParams: {showPlayerReturnDeclareModal: true}})
          return;
        }
        break;
    }
  }

  updateAfterBallChanges(bowlerObject: any,keyboardCell: any) {
    this.updateBowlerDataAfterEachBowl(bowlerObject)
    this.calculateCurrentRunRate();
    if (this.match.hasStartedSecondInning) {
      this.calculateRequiredRunRate();
      this.requiredRun -= keyboardCell.run;
      if(keyboardCell.type === 'RUN' || keyboardCell === 'RUNOUT' || keyboardCell.type === 'WICKET')
        this.ballsLeft -= 1;
    }
    if(bowlerObject.legalDeliveryCount === 6) {      
      this.updateBowlerData();
    }
    if(this.isInningCompleted()) {
      this.showInningCompletedScreen = true;
      let teamName = this.data.tossWinningTeam.includes('TEAM A') ? "TEAM B" : "TEAM A";
      this.onInningCompleted(teamName);
      this.currentBattingTeam = teamName;
      this.battingTeamLength = this.getCurrentBattingTeam().length;
    }
  }

  isInningCompleted() {
    if((this.battingTeamLength - 1) === this.match.inning[this.inning].totalWicketsFallen) {
      this.match.inning[this.inning].isAllOut = true;
    }
    return (this.match.inning[this.inning].over === this.data.overs) || (this.match.inning[this.inning].isAllOut || (this.inning === 1 && this.match.inning[this.inning].totalRunScored >= this.match.inning[this.inning-1].totalRunScored));
  }

  updateBatterAfterWicket(wicketType: string) {
    let batsman: any = {
      wicketDetails: {
        bowlerFirstName: this.currentBowlerTable.currentBowler.firstName,
        bowlerLastName: this.currentBowlerTable.currentBowler.lastName,
        fielderFirstName: null,
        fielderLastName: null,
        wicketType
      },
      isPlayerOut: true
    }
    switch(wicketType) {
      case "HW": 
        batsman = {...batsman,...this.currentBattingPairTable.battingPairList[this.onStrikePlayerIndex]};
        this.updateBatsmanData(batsman);
        this.updateInningBatsmanList(batsman);
        this.currentBattingPairTable.battingPairList[this.onStrikePlayerIndex] = this.commonService.initializeEmptyBatsmanObject(true);
        break;
      case "CW":
        batsman = {...batsman,...this.currentBattingPairTable.battingPairList[this.onStrikePlayerIndex]};
        this.batsmanId = batsman.id;
        this.updateBatsmanData(batsman);
        this.updateInningBatsmanList(batsman);
        this.router.navigate(['/home/update-score'],{queryParams: {showCaughtOutModal: true}})
        this.currentBattingPairTable.battingPairList[this.onStrikePlayerIndex] = this.commonService.initializeEmptyBatsmanObject(true);
        break;
      case "W":
        batsman = {...batsman,...this.currentBattingPairTable.battingPairList[this.onStrikePlayerIndex]};
        this.updateBatsmanData(batsman);
        this.updateInningBatsmanList(batsman);
        this.currentBattingPairTable.battingPairList[this.onStrikePlayerIndex] = this.commonService.initializeEmptyBatsmanObject(true);
        break;
    }
    this.areAllPlayersSelected = false;
  }

  updateBatsmanData(updatingBatter: any, isPlayerOut: boolean = true) {
    let team = this.getCurrentBattingTeam();
    team.forEach((batter: any) => {
      if(batter.id === updatingBatter.id) {
        batter.battingStats.run = updatingBatter.run;
        batter.battingStats.ball = updatingBatter.ball;
        batter.battingStats.six = updatingBatter.six;
        batter.battingStats.four = updatingBatter.four;
        batter.battingStats.isPlayerOut = isPlayerOut;
        batter.battingStats.isOnCrease = false;
      }
    })
  }

  updateBowlerData() {
    let team = this.getCurrentBowlingTeam();
    team.forEach((bowler: any) => {
      if(bowler.id === this.currentBowlerTable.currentBowler.id) {
        bowler.bowlingStats.over += 1;
        bowler.bowlingStats.wicket = this.currentBowlerTable.currentBowler.wicket;
        bowler.bowlingStats.run = this.currentBowlerTable.currentBowler.run;
        bowler.isCurrentBowler = false;
      }
    })
    this.updateInningBowlerList(this.currentBowlerTable.currentBowler);
    this.currentBowlerTable.currentBowler = this.commonService.initializeEmptyBowlerObject();
    this.areAllPlayersSelected= false;
  }
  
  updateOnStrikeBatsmanScore(keyboardCell: any) {
    this.currentBattingPairTable.battingPairList.forEach((batsman: any) => {
      if(batsman.isOnStrike) {
        if(keyboardCell.type !== 'NOBALL' || keyboardCell.type !== 'WIDE')
          batsman.ball++;
        batsman.run += keyboardCell.run;
        if(keyboardCell.run === 6) {
          batsman.six++;
        } else if(keyboardCell.run === 4) {
          batsman.four++;
        }
        batsman.strikeRate = ((batsman.run / batsman.ball) * 100).toFixed(0);
        this.updateMatchObjectBatsmanScore(batsman.id,batsman.run,batsman.four,batsman.six,batsman.ball,batsman.strikeRate);
      }
    })
    this.changeBatsmanStrike(keyboardCell.shouldChangeStrike);
  }
  
  changeBatsmanStrike(shouldChangeStrike: boolean) {
    if((shouldChangeStrike && !this.isNewOver) || (!shouldChangeStrike && this.isNewOver)) {
      this.currentBattingPairTable.battingPairList[0].isOnStrike = !this.currentBattingPairTable.battingPairList[0].isOnStrike;
      this.currentBattingPairTable.battingPairList[1].isOnStrike = !this.currentBattingPairTable.battingPairList[1].isOnStrike;
    }
    if(this.currentBattingPairTable.battingPairList[0].isOnStrike) {
      this.onStrikePlayerIndex = 0;
    } else {
      this.onStrikePlayerIndex = 1;
    }
  }

  updateBowlerDataAfterEachBowl(bowlerObject: any) {
    this.currentBowlerTable.currentBowler = {...this.currentBowlerTable.currentBowler,
      ...bowlerObject
    }
  }

  // Select new batsman functionality
  onNewBatsmanSelected(batsmanList: any,id: any) {
    batsmanList.forEach((player: any) => {
      if(player.id === id) {
        this.currentSelectedBatsman = player;
        player.isSelectedForBatting = true;
      } else {
        player.isSelectedForBatting = false;
      }
    })
  }

  onRetieredBatsmanSelected(index: number,isOnStrike: boolean) {
    this.retieredBatsmanIndex = index;
    this.isOnStrikeBatsmanOut = isOnStrike;
  }

  onBatsmanMarkedRetiered() {
    let retieredBatsman = this.currentBattingPairTable.battingPairList[this.retieredBatsmanIndex];
    this.updateBatsmanData(retieredBatsman, false);
    this.updateInningBatsmanList(retieredBatsman);
    this.currentBattingPairTable.battingPairList[this.retieredBatsmanIndex] = this.commonService.initializeEmptyBatsmanObject(this.isOnStrikeBatsmanOut);
    this.isOnStrikeBatsmanOut = false;
    this.retieredBatsmanIndex = -1;
    this.unableScoreKeyboard();
  }

  onBatsmanSelected() {
    let batsman = this.commonService.returnNewBatsmanObjectOnSelected(this.currentSelectedBatsman);
    this.currentBattingPairTable.battingPairList[this.changeBatsmanIndex] = {
      ...this.currentBattingPairTable.battingPairList[this.changeBatsmanIndex],
      ...batsman
    };
    let team = this.getCurrentBattingTeam();
    team.forEach((batter: any) => {
      if(batter.id === batsman.id) {
        batter.isSelectedForBatting = false;
        batter.battingStats.isOnCrease = true;
        batter.hasBatted = true;
      }
    })
    this.updateInningBatsmanList(batsman);
    this.currentSelectedBatsman = {};
    this.unableScoreKeyboard();
  }

  // Select new bowler functionality

  onNewBowlerSelected(bowlerList: any,id: any) {
    bowlerList.forEach((player: any) => {
      if(player.id === id) {
        this.currentSelectedBowler = player;
        player.isSelectedForBowing = true;
      } else {
        player.isSelectedForBowing = false;
      }
    })
  }

  onBowlerSelected() {
    this.currentBowlerTable.currentBowler = this.commonService.returnNewBowlerObjectOnSelected(this.currentSelectedBowler);
    this.onNewBowlerSelected(this.getCurrentBowlingTeam(),"");
    this.currentSelectedBowler = {};
    this.unableScoreKeyboard();
    this.runScoredInLastOver = 0;
  }

  // Select new fielder for catch out and run out functionality

  onNewFielderSelected(bowlerList: any,id: any) {
    bowlerList.forEach((player: any) => {
      if(player.id === id) {
        this.currentSelectedFielder = player;
        player.isSelectedForFielding = true;
      } else {
        player.isSelectedForFielding = false;
      }
    })
  }

  onFielderSelected() {
    this.match.inning[this.inning].batsmanList.forEach((batsman: any) => {
      if(batsman.id === this.batsmanId) {
        batsman.wicketDetails.fielderFirstName = this.currentSelectedFielder.firstName;
        batsman.wicketDetails.fielderLastName = this.currentSelectedFielder.lastName;
      }
    })
    this.getCurrentBowlingTeam().forEach((player: any) => {
      if(player.id === this.currentSelectedFielder.id) {
        player.catch += 1;
        player.catchTaken += 1;
      }        
      player.isSelectedForFielding = false;
    });
    this.currentSelectedFielder = {};
    this.batsmanId = "";
  }

  onRunOutBatsmanSelected(id: string) {
    this.currentRunOutBatsmanIndex = -1;
    this.currentBattingPairTable.battingPairList.forEach((player: any,index: any) => {
      if(player.id === id) {
        this.currentRunOutBatsmanIndex = index;
        this.currentRunOutBatsman = player;
        player.isSelectedForRunOut = true;
      } else {
        player.isSelectedForRunOut = false;
      }
    })
  }

  onRunOutDataSelected() {
    let batsman: any = {
      wicketDetails: {
        bowlerFirstName: null,
        bowlerLastName: null,
        fielderFirstName: this.currentSelectedFielder.firstName,
        fielderLastName: this.currentSelectedFielder.lastName,
        wicketType: "RN"
      }
    }
    this.currentBattingPairTable.battingPairList[this.currentRunOutBatsmanIndex].isSelectedForRunOut = false;
    batsman = {...batsman,...this.currentBattingPairTable.battingPairList[this.currentRunOutBatsmanIndex]};
    this.batsmanId = batsman.id;
    this.updateBatsmanData(batsman);
    this.updateInningBatsmanList(batsman);
    this.getCurrentBowlingTeam().forEach((player: any) => {
      if(player.id === this.currentSelectedFielder.id) {
        player.runOutAttempt += 1;
      }        
      player.isSelectedForFielding = false;
    });
    this.currentSelectedFielder = {};
    this.batsmanId = "";
    if(this.currentRunOutBatsmanIndex === 1) {
      this.currentBattingPairTable.battingPairList[this.currentRunOutBatsmanIndex] = this.commonService.initializeEmptyBatsmanObject(this.isOnStrikeBatsmanRunOut);
      this.currentBattingPairTable.battingPairList[0].isOnStrike = !this.isOnStrikeBatsmanRunOut;
    } else {
      this.currentBattingPairTable.battingPairList[this.currentRunOutBatsmanIndex] = this.commonService.initializeEmptyBatsmanObject(this.isOnStrikeBatsmanRunOut);
      this.currentBattingPairTable.battingPairList[1].isOnStrike = !this.isOnStrikeBatsmanRunOut;
    };
    this.updateAfterBallChanges(this.bowlerObject,this.keyboardCell);
  }

  unableScoreKeyboard() {
    if(this.currentBowlerTable.currentBowler.id) {
      this.areAllPlayersSelected = true;
    }
    this.currentBattingPairTable.battingPairList.forEach((batsman: any) => {
      if(!batsman.id) {
        this.areAllPlayersSelected = false;
      }
    });
    if(this.areAllPlayersSelected) {
      this.hasStartedInning = true
    }
  }

  changeBatsman(index: number) {
    this.changeBatsmanIndex = index;
  }

  findBatsmanById(batsmanId: string) {
    return this.match.inning[this.inning].batsmanList.findIndex((batsman: any) => {
      return batsman.id === batsmanId
    })
  }

  updateInningBatsmanList(batsman: any) {
    let index = this.findBatsmanById(batsman.id);
    if(index === -1) {
      this.match.inning[this.inning].batsmanList.push(batsman);
    } else {
      this.match.inning[this.inning].batsmanList[index] = batsman
    }
  }

  updateMatchObjectBatsmanScore(id: string,run: number,four: number,six: number,ball: number, strikeRate: string) {
    this.match.inning[this.inning].batsmanList.forEach((batter: any) => {
      if(batter.id === id) {
        batter.run = run;
        batter.ball = ball;
        batter.six = six;
        batter.four = four;
        batter.strikeRate = strikeRate
      }
    })
  }

  updateInningBowlerList(bowler: any) {
    this.match.inning[this.inning].bowlerList.push(bowler);
  }

  setAfterMatchMessage() {
    if(this.match.inning[1].totalRunScored >= this.match.inning[0].totalRunScored) {
      return this.match.battingTeam + " won by " + this.ballsLeft + " in hand";
    } else if(this.match.inning[1].isAllOut) {
      return this.data.tossWinningTeam + " wom by " + (this.match.inning[0].totalRunScored - this.match.inning[1].totalRunScored)
    }
    return "";
  }
}

