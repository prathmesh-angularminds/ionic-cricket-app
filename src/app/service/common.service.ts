import { Injectable } from '@angular/core';
import { Data } from '../models/data';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(public data: Data) { }

  initDataValues() {
    this.data.allPlayersList.forEach((player: any) => {
      player.isSelected = false;
      player.teamName = ""
    })
    this.data.overs = 0;
    this.data.teamAPlayersList = [];
    this.data.teamBPlayersList = [];
  } 
}
