import { importProvidersFrom, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterOutlet } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { IonicStorageModule } from "@ionic/storage-angular"
import { Drivers } from "@ionic/storage"


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LayoutModule } from './layout/layout.module';
import { SharedModule } from './shared/shared.module';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, RouterOutlet, IonicModule.forRoot(), AppRoutingModule,LayoutModule,SharedModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    importProvidersFrom(IonicStorageModule.forRoot({
      name: 'testdb',
      driverOrder: [Drivers.IndexedDB]
    }))
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
