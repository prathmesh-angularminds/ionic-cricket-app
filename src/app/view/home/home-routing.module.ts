import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerProfileComponent } from './player-profile/player-profile.component';
import { PlayerListComponent } from './player-list/player-list.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
