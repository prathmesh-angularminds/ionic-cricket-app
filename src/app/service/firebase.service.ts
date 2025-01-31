import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, getDoc, collectionData, updateDoc, arrayUnion, where, CollectionReference, query, deleteDoc, arrayRemove, getDocs, doc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Player } from '../models/player.interface';
import { Data } from '../models/data';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  player = collection(this.fireStore,'players');
  match = collection(this.fireStore,'match');
  matchCardList = collection(this.fireStore,'matchCardList');
  matchId: string = "";
  constructor(private fireStore: Firestore, public data: Data, public router: Router) {}

  getDocument(id: string,collection: string) {
    return doc(this.fireStore,collection,id);
  }

  getQuery(collectionRef: CollectionReference) {
    let todaysDate = new Date().toISOString().split('T')[0];
    return query(
      collectionRef,
      where('date','==',todaysDate),
    )
  }

  getDocumentById(id: string,collection: string) {
    const data = this.getDocument(id,collection);
    return getDoc(data).then((res: any) => {
      if(res.exists()) {
        console.log(res.data());
        return res.data();
      }
    })
  }

  // Player 

  getPlayerList(): Observable<any> {
    return collectionData(this.player, {idField: 'id'})
  }

  addNewPlayer(player: any) {
    return from(addDoc(this.player,player))
  }

  getPlayerById(id: string) {
    return from(this.getDocumentById(id,'players'))
  }

  updatePlayer(player: any) {
    let docRef = doc(this.fireStore,'players',player.id);
    return from(updateDoc(docRef,player));
  }

  deletePlayer(playerId: string) {
    let docRef = this.getDocument(playerId,'players');
    return from(deleteDoc(docRef))
  }

  // Match 

  getMatchById(id: string) {
    return from(this.getDocumentById(id,'match'));
  }

  addMatch(match: any) {
    addDoc(this.match,match).then((response) => {
      console.log("New Match added",response.id);
      match.matchCard['id'] = response.id;
      this.matchId = response.id; 
      this.getMatchCardByDate(match.matchCard);
    })
  }

  getMatchCardByDate(matchCard: any) {
    getDocs(this.getQuery(this.matchCardList)).then((res: any) => {
      console.log(res?.docs);
      if(res.docs.length) {
        res.forEach((doc: any) => {
          console.log(doc.id);
          this.updateMatchCardList(doc.id,matchCard);
        })
      } else {
        this.addNewMatchCard(matchCard);
      }
    })
  }

  addNewMatchCard(matchCard: any) {
    let matchCardData = {
      date: new Date().toISOString().split('T')[0],
      match: [matchCard]
    }
    addDoc(this.matchCardList,matchCardData).then((response) => {
      this.router.navigate(['/home/match-summary'],{queryParams: {id: this.matchId,matchCardId: response.id}});
      console.log("New Match card list: ",this.matchId);
    })
  }

  deleteMatch(id: string,matchCardId: string) {
    this.getDocumentById(id,'match').then((res: any) => {
      let doc = this.getDocument(id,'match');
      deleteDoc(doc).then(() => {
        let matchCard = res.matchCard;
        matchCard.id = id;
        this.getMatchCard(matchCardId,matchCard);
      })
    })
  }

  // Match card list

  getMatchCardList() {
    return collectionData(this.matchCardList, {idField: 'id'})
  }

  getMatchCard(id: string,matchCard: any) {
    this.getDocumentById(id,'matchCardList').then((res: any) => {
      if(res.match.length === 1) {
        this.deleteMatchCard(id);
      } else {
        this.deleteMatchCardById(id,matchCard);
      }
    });
  }

  updateMatchCardList(matchCardId: string,matchCard: any) {
    const doc = this.getDocument(matchCardId,'matchCardList');
    updateDoc(doc,{
      match: arrayUnion(matchCard)
    });
    console.log("Match id :",this.matchId);
    this.router.navigate(['/home/match-summary'],{queryParams: {id: this.matchId,matchCardId: matchCardId}});
  }

  deleteMatchCardById(id:string, matchCard: any) {
    const doc = this.getDocument(id,'matchCardList');
    updateDoc(doc,{
      match: arrayRemove(matchCard)
    }).then((res: any) => {})
  }

  deleteMatchCard(id: string) {
    let doc = this.getDocument(id,'matchCardList');
    deleteDoc(doc).then(() => {
    })
  }
}