import { Component } from '@angular/core';
import { AppStorageService } from './service/app-storage.service';
import { Data } from './models/data';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private storage: AppStorageService, public data: Data) {
    this.getIsMatchPlayedData();
  }

  getIsMatchPlayedData() {
    this.storage.get('isMatchPlayed').subscribe((isMatchPlayed: boolean | null) => {
      if(isMatchPlayed) {
        this.data.isMatchPlayed = isMatchPlayed;
      } else {
        this.storage.set('isMatchPlayed',this.data.isMatchPlayed);
      }
    })
  }
}
