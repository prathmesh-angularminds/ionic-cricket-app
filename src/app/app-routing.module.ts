import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './layout/auth/auth.component';
import { HomeComponent } from './layout/home/home.component';
import { ErrorComponent } from './error/error.component';

const routes: Routes = [
  {
    path: "auth",
    component: AuthComponent,
  },
  {
    path: "home",
    component: HomeComponent,
    children: [
      {
        path: "",
        loadChildren: () => import('./view/home/home.module').then(m => m.HomeModule)
      }
    ]
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: "**",
    component: ErrorComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
