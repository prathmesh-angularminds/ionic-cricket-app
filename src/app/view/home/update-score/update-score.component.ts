import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-update-score',
  templateUrl: './update-score.component.html',
  styleUrls: ['./update-score.component.scss'],
})
export class UpdateScoreComponent  implements OnInit {

  url: string = '/home/match-list'
  constructor() { }

  ngOnInit() {}

}
