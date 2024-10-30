import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit {

  playersButton: boolean = false;
  matchesButton: boolean = true;
  showNavbar: boolean = false;
  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.pipe(filter((event: any) => event instanceof NavigationEnd)).subscribe((route: any) => {
      console.log(route);
      let url = route.urlAfterRedirects
      if(url.includes('player-list') || url.includes('match-list')) {
        this.showNavbar = true;
        this.setActiveNavbarButton(url.split('/')[2]);
      } else {
        this.showNavbar = false
      }
    })
  }

  setActiveNavbarButton(label: string) {
    if(label === 'match-list' || label === 'home') {
      this.playersButton = false;
      this.matchesButton = true;
    } else {
      this.playersButton = true;
      this.matchesButton = false;
    }
  }

}
