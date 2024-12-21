import { inject, Injectable } from '@angular/core';
import { Firestore, addDoc, collection, getDoc, doc, collectionData } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Player } from '../models/player.interface';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  player = collection(this.fireStore,'players');
  constructor(private fireStore: Firestore) {}

  getPlayerList(): Observable<any> {
    return collectionData(this.player, {idField: 'id'})
  }

  addPlayer(player: Player) {
    addDoc(this.player,player).then((response) => {
      console.log(response.id)
    });
  }

  getDocument(id: string) {
    return doc(this.fireStore,'players',id);
  }

  getPlayerById(id: string) {
    const data = this.getDocument(id);
    return from(
      getDoc(data).then((res: any) => {
        if(res.exists()) {
          console.log(res.data());
          return res.data();
        }
        console.log("Response: ",res);
      })
    )
  }
}