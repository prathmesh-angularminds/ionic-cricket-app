import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { PlayerProfileComponent } from './player-profile/player-profile.component';
import { SharedModule } from "../../shared/shared.module";
import { BackButtonComponent } from "../../shared/back-button/back-button.component";
import { RouterLink } from '@angular/router';
import { PlayerListComponent } from './player-list/player-list.component';
import { MatchListComponent } from './match-list/match-list.component';


@NgModule({
  declarations: [PlayerProfileComponent,PlayerListComponent,MatchListComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    BackButtonComponent,
    RouterLink
]
})
export class HomeModule { }
