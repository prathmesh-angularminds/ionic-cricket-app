import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerProfileComponent } from './player-profile/player-profile.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { MatchListComponent } from './match-list/match-list.component';
import { MatchSummaryComponent } from './match-summary/match-summary.component';
import { UpdateScoreComponent } from './update-score/update-score.component';
import { CreateMatchComponent } from './create-match/create-match.component';
import { AddTeamPlayersComponent } from './add-team-players/add-team-players.component';
import { AddNewPlayerComponent } from './add-new-player/add-new-player.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "player-list",
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
    path: "create-new-match",
    component: CreateMatchComponent
  },
  {
    path: "add-team-players",
    component: AddTeamPlayersComponent
  },
  {
    path: "add-new-player",
    component: AddNewPlayerComponent
  },
  {
    path: "edit-player",
    component: AddNewPlayerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
