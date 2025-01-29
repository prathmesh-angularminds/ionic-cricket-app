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
  currentSelectedBatsman: any = null;
  currentSelectedBowler: any = null;
  currentSelectedFielder: any = null;
  isOnStrikeBatsmanOut: boolean = false;
  showNewBatsmanModal: boolean = false;
  showNewBowlerModal: boolean = false;
  showPlayerReturnDeclareModal: boolean = false;
  showCaughtOutModal: boolean = false;
  showRunOutModal: boolean = false;
  isInitSetup: boolean = true;
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
  currentRunOutBatsman: any = null;
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
  showCatchDropModal: any = false;
  dropDownList: any = [
    {
      label: "Catch drop",
      url: "/home/update-score",
      queryParam: {showCatchDropModal: true}
    },
  ]
  matchCompleted = false;
  image: string = "https://asset.cloudinary.com/dgoc3knjv/b2c7be912fa844d8a520724ba11d8d1e";
  onStrikeBatsmanIndex: number = 0;
  showCatchDropedAlerMessage: boolean = false;
  showRunoutAlertMessage: boolean = false;
  showCatchAlertMessage: boolean = false;
  showBowlerAlertMessage: boolean = false;
  showBatsmanAlertMessage: boolean = false;
  showRetieredPlayerAlertMessage: boolean = false;

  constructor(
    public data: Data,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public commonService: CommonService,
    public firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    this.scoreKeyboard = this.data.scoreKeyboard;
    this.teamA = JSON.parse(JSON.stringify(this.commonService.updatePlayersObject(this.data.teamAPlayersList)));
    this.teamB = JSON.parse(JSON.stringify(this.commonService.updatePlayersObject(this.data.teamBPlayersList)));
    this.currentBattingTeam = this.data.tossWinningTeam;
    this.battingTeamLength = this.getCurrentBattingTeam().length;
    this.initMatchObject();
    this.initCurrentBowlersBatsmanList();
    this.activatedRoute.queryParams.subscribe({
      next: (params: any) => {
        this.showNewBatsmanModal = params?.showNewBatsmanModal;
        this.showNewBowlerModal = params?.showNewBowlerModal;
        this.showPlayerReturnDeclareModal = params?.showPlayerReturnDeclareModal;
        this.showCaughtOutModal = params?.showCaughtOutModal;
        this.showRunOutModal = params?.showRunOutModal;
        this.showCatchDropModal = params?.showCatchDropModal;
      }
    })
  }

  initMatchObject() {
    this.match = this.commonService.initMatchObject(1,this.currentBattingTeam);
  }

  getCurrentBattingTeam() {
    if(this.currentBattingTeam.includes('SANGHARSH A')) {
      return this.teamA;
    }
    if(this.currentBattingTeam.includes('SANGHARSH B')) {
      return this.teamB;
    }
  }

  getCurrentBowlingTeam() {
    if(this.currentBattingTeam.includes('SANGHARSH A')) {
      return this.teamB;
    }
    if(this.currentBattingTeam.includes('SANGHARSH B')) {
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
    run = this.getCurrentBowlerProperties('run') + run;
    let overs = Number(((this.getCurrentBowlerProperties('over') + "").split('.')[0])) + (totalDeliveryBowled / 6) 
    return Math.round(run / overs);
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
    if(this.inning === 0) {
      this.match.inning[this.inning].totalRunScored++; 
    }
    this.target = this.match.inning[this.inning].totalRunScored;
    this.requiredRun = this.target;
    this.inning++;
    if(this.inning === 2) {
      this.data.isMatchPlayed = true;
      this.match.afterMatchMessage = this.setAfterMatchMessage();
      this.data.match = this.match;
      this.match['matchCard'] = this.commonService.createMatchCard();
      if(this.data.shouldUpdatePlayerData) {
        this.updatePlayerData();
      }
      this.firebaseService.addMatch(this.match);
      this.matchCompleted = true
      return;
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
        if(keyboardCell.run) {
          this.updateOnStrikeBatsmanScore(keyboardCell);
        }
        var label: string = (keyboardCell.run - 1) ? (keyboardCell.run - 1) + " NB" : "NB";
        bowlerObject.ball = this.updateCurrentBowlerList(keyboardCell.class,label,keyboardCell.run,keyboardCell.type)
        this.updateAfterBallChanges(bowlerObject,keyboardCell);
        break;
      // RO, 1 + RO, 2 + RO, 3 + RO, 4 + RO
      case "RUNOUT": 
        this.showRunoutAlertMessage = false;
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
        this.showCatchAlertMessage = false;
        this.updateBatterAfterWicket(keyboardCell.label,bowlerObject.legalDeliveryCount);
        bowlerObject.ball = this.updateCurrentBowlerList(keyboardCell.class,"W",keyboardCell.run,keyboardCell.type)
        this.match.inning[this.inning].totalWicketsFallen++;
        this.updateAfterBallChanges(bowlerObject,keyboardCell);
        this.changeBatsmanStrike(keyboardCell.shouldChangeStrike);
        break;
      case "RETIRED_HURT":
        this.showRetieredPlayerAlertMessage = false;
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
      if(this.currentBowlerTable.currentBowler.ball.length !== 0) {
        this.updateBowlerData();  // Update bowler after match is finished
      }
      this.updateBatsmanAfterInningCompleted();
      let teamName = this.data.tossWinningTeam.includes('SANGHARSH A') ? "SANGHARSH B" : "SANGHARSH A";
      this.onInningCompleted(teamName);
      this.showInningCompletedScreen = true;
      this.currentBattingTeam = teamName;
      this.battingTeamLength = this.getCurrentBattingTeam().length;
    }
  }

  updateBatsmanAfterInningCompleted() {
    this.currentBattingPairTable.battingPairList.forEach((batsman: any) => {
      batsman.isPlayerOut = false;
      batsman.wicketDetails = null;
      this.batsmanId = batsman.id;
      this.updateBatsmanData(batsman);
      this.updateInningBatsmanList(batsman);
    })
  }

  isInningCompleted() {
    if((this.battingTeamLength - 1) === this.match.inning[this.inning].totalWicketsFallen) {
      this.match.inning[this.inning].isAllOut = true;
      return true;
    }
    // over completed
    if(this.match.inning[this.inning].over === this.data.overs) {
      return true;
    }
    // Score not able to complete
    if(this.inning === 1 && this.match.inning[this.inning].totalRunScored >= this.match.inning[this.inning-1].totalRunScored) {
      return true;
    }
    return false;
  }

  updateBatterAfterWicket(wicketType: string,legalDeliveryCount: number) {
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
    batsman = {...batsman,...this.currentBattingPairTable.battingPairList[this.onStrikeBatsmanIndex]};
    batsman.isPlayerOut = true;
    batsman.ball += 1;
    switch(wicketType) {
      case "HW": 
        this.updateBatsmanData(batsman);
        this.updateInningBatsmanList(batsman);
        this.currentBattingPairTable.battingPairList[this.onStrikeBatsmanIndex] = this.commonService.initializeEmptyBatsmanObject(true);
        break;
      case "CAUGHT":
        this.batsmanId = batsman.id;
        this.updateBatsmanData(batsman);
        this.updateInningBatsmanList(batsman);
        this.router.navigate(['/home/update-score'],{queryParams: {showCaughtOutModal: true}})
        this.currentBattingPairTable.battingPairList[this.onStrikeBatsmanIndex] = this.commonService.initializeEmptyBatsmanObject(true);
        break;
      case "BOLD":
        this.updateBatsmanData(batsman);
        this.updateInningBatsmanList(batsman);
        this.currentBattingPairTable.battingPairList[this.onStrikeBatsmanIndex] = this.commonService.initializeEmptyBatsmanObject(true);
        break;
    }
    this.areAllPlayersSelected = false;
  }

  updateBatsmanData(updatingBatter: any, isPlayerOut: boolean = true) {
    let team = this.getCurrentBattingTeam();
    team.forEach((batter: any) => {
      if(batter.id === updatingBatter.id) {
        batter.battingDetails.run = updatingBatter.run;
        batter.battingDetails.ball = updatingBatter.ball;
        batter.battingDetails.six = updatingBatter.six;
        batter.battingDetails.four = updatingBatter.four;
        batter.battingDetails.isPlayerOut = isPlayerOut;
        batter.battingDetails.isOnCrease = false;
        batter.battingDetails.strikeRate = Number(((updatingBatter.run / updatingBatter.ball) * 100).toFixed(0));
      }
    })
  }

  updateBowlerData() {
    let team = this.getCurrentBowlingTeam();
    team.forEach((bowler: any) => {
      if(bowler.id === this.currentBowlerTable.currentBowler.id) {
        bowler.bowlingDetails.over += 1;
        bowler.bowlingDetails.wicket = this.currentBowlerTable.currentBowler.wicket;
        bowler.bowlingDetails.run = this.currentBowlerTable.currentBowler.run;
        bowler.bowlingDetails.economy = Math.round(this.currentBowlerTable.currentBowler.run / bowler.bowlingDetails.over);
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
        if(keyboardCell.type !== 'NOBALL' && keyboardCell.type !== 'WIDE')
          batsman.ball++;
        if(keyboardCell.type === 'NOBALL') {
          batsman.run += (keyboardCell.run - 1);
        } else if(keyboardCell.type === 'WIDE') {
          batsman.run += 0;
        } else {
          batsman.run += keyboardCell.run;
        }
        if(keyboardCell.run === 6 || keyboardCell.type === '6 + NB') {
          batsman.six++;
        } else if(keyboardCell.run === 4 || keyboardCell.type === '4 + NB') {
          batsman.four++;
        }
        if(keyboardCell.type !== 'NOBALL' && keyboardCell.type !== 'WIDE') {
          batsman.strikeRate = ((batsman.run / batsman.ball) * 100).toFixed(0);
        }
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
      this.onStrikeBatsmanIndex = 0;
    } else {
      this.onStrikeBatsmanIndex = 1;
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
    if(this.retieredBatsmanIndex === -1) {
      this.showRetieredPlayerAlertMessage = true;
      return;
    }
    this.showRetieredPlayerAlertMessage = false;
    let retieredBatsman = this.currentBattingPairTable.battingPairList[this.retieredBatsmanIndex];
    this.updateBatsmanData(retieredBatsman, false);
    this.updateInningBatsmanList(retieredBatsman);
    this.currentBattingPairTable.battingPairList[this.retieredBatsmanIndex] = this.commonService.initializeEmptyBatsmanObject(this.isOnStrikeBatsmanOut);
    this.isOnStrikeBatsmanOut = false;
    this.retieredBatsmanIndex = -1;
    this.router.navigate(['/home/update-score'],{queryParams: {showPlayerReturnDeclareModal: null}});
    this.unableScoreKeyboard();
  }

  onBatsmanSelected() {
    if(!this.currentSelectedBatsman) {
      this.showBatsmanAlertMessage = true;
      return;
    }
    this.showBatsmanAlertMessage = false;
    let batsman = this.commonService.returnNewBatsmanObjectOnSelected(this.currentSelectedBatsman);
    this.currentBattingPairTable.battingPairList[this.changeBatsmanIndex] = {
      ...this.currentBattingPairTable.battingPairList[this.changeBatsmanIndex],
      ...batsman
    };
    let team = this.getCurrentBattingTeam();
    team.forEach((batter: any) => {
      if(batter.id === batsman.id) {
        batter.isSelectedForBatting = false;
        batter.battingDetails.isOnCrease = true;
        batter.hasBatted = true;
      }
    })
    this.updateInningBatsmanList(batsman);
    this.currentSelectedBatsman = null;
    this.unableScoreKeyboard();
    this.router.navigate(['/home/update-score'],{queryParams: {showNewBatsmanModal: null}})
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
    if(!this.currentSelectedBowler) {
      this.showBowlerAlertMessage = true;
      return;
    }
    this.showBowlerAlertMessage = false;
    this.currentBowlerTable.currentBowler = this.commonService.returnNewBowlerObjectOnSelected(this.currentSelectedBowler);
    this.onNewBowlerSelected(this.getCurrentBowlingTeam(),"");
    this.currentSelectedBowler = null;
    this.unableScoreKeyboard();
    this.runScoredInLastOver = 0;
    this.router.navigate(['/home/update-score'],{queryParams: {showNewBowlerModal: null}})
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
    if(!this.currentSelectedFielder) {
      this.showCatchAlertMessage = true;
      return;
    }
    this.showCatchAlertMessage = false;
    this.match.inning[this.inning].batsmanList.forEach((batsman: any) => {
      if(batsman.id === this.batsmanId) {
        batsman.wicketDetails.fielderFirstName = this.currentSelectedFielder.firstName;
        batsman.wicketDetails.fielderLastName = this.currentSelectedFielder.lastName;
      }
    })
    this.getCurrentBowlingTeam().forEach((player: any) => {
      if(player.id === this.currentSelectedFielder.id) {
        player.fieldingDetails.catch += 1;
        player.fieldingDetails.catchTaken += 1;
      }        
      player.isSelectedForFielding = false;
    });
    this.currentSelectedFielder = null;
    this.batsmanId = "";
    this.router.navigate(['/home/update-score'],{queryParams: {showCaughtOutModal: null}});
  }

  onCatchDropedFielderSelected() {
    if(!this.currentSelectedFielder) {
      this.showCatchDropedAlerMessage = true;
      return;
    }

    this.showCatchDropedAlerMessage = false;
    this.getCurrentBowlingTeam().forEach((player: any) => {
      if(player.id === this.currentSelectedFielder.id) {
        player.fieldingDetails.catch += 1;
      }        
      player.isSelectedForFielding = false;
    });
    this.currentSelectedFielder = null;
    this.router.navigate(['/home/update-score'],{queryParams: {showCaughtOutModal: null}});
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
    if(!this.currentRunOutBatsman || !this.currentSelectedFielder) {
      this.showRunoutAlertMessage = true
      return;
    }
    this.showRunoutAlertMessage = false;
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
    batsman.isPlayerOut = true;
    this.batsmanId = batsman.id;
    this.updateBatsmanData(batsman);
    this.updateInningBatsmanList(batsman);
    this.getCurrentBowlingTeam().forEach((player: any) => {
      if(player.id === this.currentSelectedFielder.id) {
        player.runOutAttempt += 1;
      }        
      player.isSelectedForFielding = false;
    });
    this.batsmanId = "";
    if(this.bowlerObject.legalDeliveryCount === 6) {  // IF runout happens the condition should reverse
      this.isOnStrikeBatsmanOut = !this.isOnStrikeBatsmanOut;
    }
    if(this.currentRunOutBatsmanIndex === 1) {
      this.currentBattingPairTable.battingPairList[this.currentRunOutBatsmanIndex] = this.commonService.initializeEmptyBatsmanObject(this.isOnStrikeBatsmanRunOut);
      this.currentBattingPairTable.battingPairList[0].isOnStrike = !this.isOnStrikeBatsmanRunOut;
    } else {
      this.currentBattingPairTable.battingPairList[this.currentRunOutBatsmanIndex] = this.commonService.initializeEmptyBatsmanObject(this.isOnStrikeBatsmanRunOut);
      this.currentBattingPairTable.battingPairList[1].isOnStrike = !this.isOnStrikeBatsmanRunOut;
    };
    this.updateAfterBallChanges(this.bowlerObject,this.keyboardCell);
    this.bowlerObject = {};
    this.keyboardCell = {};
    this.isOnStrikeBatsmanRunOut = false
    this.currentRunOutBatsman = null;
    this.currentSelectedFielder = null;
    this.router.navigate(['/home/update-score'],{queryParams: {showRunOutModal: null}});
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
      return this.match.inning[1].battingTeam + " won by " + this.ballsLeft + " balls in hand"
    } else if(this.match.inning[0].totalRunScored > this.match.inning[1].totalRunScored) {
      return this.match.inning[0].battingTeam + " won by " + (this.match.inning[0].totalRunScored - this.match.inning[1].totalRunScored) + " runs";
    }
    return "";
  }

  updatePlayerData() {
    let allPlayerList = [...this.teamA,...this.teamB];
    allPlayerList.forEach((player: any) => {
      this.commonService.getPlayerUpdateObject(player);
    });
  }

  initializeAlertMessageFlag(flag: string) {
    if(flag === 'NEW_BATSMAN') {
      this.showBatsmanAlertMessage = false;
    } else if(flag === 'NEW_BOWLER') {
      this.showBowlerAlertMessage = false;
    } else {
      this.showCatchDropedAlerMessage = false;
    }
  }
}

