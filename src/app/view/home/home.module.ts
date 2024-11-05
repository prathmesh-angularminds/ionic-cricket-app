import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from "../../shared/shared.module";
import { RouterLink } from '@angular/router';

// Components
import { BackButtonComponent } from "../../shared/back-button/back-button.component";
import { PlayerProfileComponent } from './player-profile/player-profile.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { MatchListComponent } from './match-list/match-list.component';
import { MatchSummaryComponent } from './match-summary/match-summary.component';
import { UpdateScoreComponent } from './update-score/update-score.component';
import { SelectPlayerComponent } from './select-player/select-player.component';
import { CreateMatchComponent } from './create-match/create-match.component';


@NgModule({
  declarations: [PlayerProfileComponent,PlayerListComponent,MatchListComponent,MatchSummaryComponent,UpdateScoreComponent,SelectPlayerComponent, CreateMatchComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    BackButtonComponent,
    RouterLink
]
})
export class HomeModule { }
