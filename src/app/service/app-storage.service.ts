import { Injectable, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStorageService implements OnInit {

  constructor(private _storage: Storage) { 
    this._storage.create();
  }

  ngOnInit() { }

  public get(key: string): Observable<any> {
    return from(
      this._storage?.get(key).then((data: any) => {
        console.log("Data",data);
        if(data) {
          return data;
        }
      })
    );
  }

  public async set(key: string,value: any) {
    return await this._storage?.set(key,value)
  }
}
