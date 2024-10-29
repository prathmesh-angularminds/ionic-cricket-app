import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerProfileComponent } from './player-profile/player-profile.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { MatchListComponent } from './match-list/match-list.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
