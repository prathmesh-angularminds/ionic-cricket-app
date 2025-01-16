import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-add-new-player',
  templateUrl: './add-new-player.component.html',
  styleUrls: ['./add-new-player.component.scss'],
})
export class AddNewPlayerComponent  implements OnInit {

  pageTitle: string = "";
  playerForm!: FormGroup;
  player: any = {
    firstName: "",
    lastName: "",
    jerseyNumber: "",
    playerType: "Batsman",
  }
  playerId: string = "";

  constructor(
    public fb: FormBuilder,
    public firebaseService: FirebaseService,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((param: any) => {
      if(param.id) {
        this.playerId = param.id;
        this.getPlayerData(param.id);
        console.log(this.router.url);
      } else {
        this.initiateForm();
      }
    })
  }

  initiateForm() {
    this.playerForm = this.fb.group({
      firstName: [this.player.firstName,Validators.required],
      lastName: [this.player.lastName,Validators.required],
      jerseyNumber: [this.player.jerseyNumber,Validators.required],
      playerType: [this.player.playerType,Validators.required],
    })
  }

  get firstName(): any {
    return this.playerForm.get('firstName');
  }

  get lastName(): any {
    return this.playerForm.get('lastName');
  }

  get jerseyNumber(): any {
    return this.playerForm.get('jerseyNumber');
  }

  get playerType(): any {
    return this.playerForm.get('playerType');
  }

  getPlayerData(id: string) {
    this.firebaseService.getPlayerById(id).subscribe({
      next: (player: any) => {
        this.player = player;
        this.initiateForm();
      }
    })
  }

  newPlayerObject(player: any) {
    return {
      "playerType": player.playerType,
      "bowlingDetails": {
        "wicket": 0,
        "average": 0,
        "over": 0,
        "economy": 0,
        "mostWicket": 0,
        "run": 0
      },
      "lastName": player.lastName,
      "jerseyNumber": player.jerseyNumber,
      "firstName": player.firstName,
      "battingDetails": {
        "ball": 0,
        "run": 0,
        "average": 0,
        "four": 0,
        "dismissedCount": 0,
        "strikeRate": 0,
        "six": 0
      },
      "match": 0,
      "fullName": player.firstName + " " + player.lastName,
      "bowlingHand": "RIGHT HANDED",
      "battingHand": "RIGHT HANDED",
      "fieldingDetails": {
        "catchDroped": 0,
        "catch": 0,
        "catchTaken": 0,
        "fieldingAvg": 0,
        "runOutAttempt": 0
      },
    }
  }

  onSavePlayerData() {
    if(this.playerForm.invalid) {
      return;
    }
    let newPlayer = this.newPlayerObject(this.playerForm.value);
    this.firebaseService.addNewPlayer(newPlayer).subscribe({
      next: () => {
        this.router.navigate(['/home/player-list']);
      }
    });
  }

  updatePlayerData() {
    if(this.playerForm.invalid) {
      return;
    }
    let player = this.playerForm.value;
    let newPlayerData = {
      "id": this.playerId,
      "lastName": player.lastName,
      "jerseyNumber": player.jerseyNumber,
      "firstName": player.firstName,
      "playerType": player.playerType,
      "fullName": player.firstName + " " + player.lastName
    }
    this.firebaseService.updatePlayer(newPlayerData).subscribe({
      next: () => {
        this.router.navigate(['/home/player-profile'],{queryParams: {id: this.playerId}});
      }
    })
  }
}
