import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerProfileComponent } from './player-profile/player-profile.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { MatchListComponent } from './match-list/match-list.component';
import { MatchSummaryComponent } from './match-summary/match-summary.component';
import { UpdateScoreComponent } from './update-score/update-score.component';
import { CreateMatchComponent } from './create-match/create-match.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "match-list",
    pathMatch: 'full'
  },
  {
    path: "player-profile",
    component: PlayerProfileComponent
  },
  {
    path: "player-list",
    component: PlayerListComponent
  },
  {
    path: "match-list",
    component: MatchListComponent
  },
  {
    path: "match-summary",
    component: MatchSummaryComponent
  },
  {
    path: "update-score",
    component: UpdateScoreComponent
  },
  {
    path: "create-match",
    component: CreateMatchComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
