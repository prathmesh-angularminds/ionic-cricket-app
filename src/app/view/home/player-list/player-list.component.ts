import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss'],
})
export class PlayerListComponent  implements OnInit {

  pageTitle: string = "Player's";
  addNewPlayerButtonLabel: string = "Add New Player";
  constructor(private router: Router) { }

  ngOnInit() {}

  viewPlayerDetails() {
    this.router.navigate(['/home/player-profile']);
  }

}
