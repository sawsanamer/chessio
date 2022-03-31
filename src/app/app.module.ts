import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChessBoardModule } from 'ngx-chess-board';
import { AppComponent } from './app.component';
import { IframeComponent } from './play/iframe/iframe.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { PlayComponent } from './play/play.component';
import { HeaderComponent } from './header/header.component';
import { LiveComponent } from './live/live.component';
import { LiveGameComponent } from './live/live-game/live-game.component';
import { WaitingComponent } from './live/waiting/waiting.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { FormsModule } from '@angular/forms';
import { LiveGameManagerService } from './live/services/live-game-manager.service';
import { DatabaseHandler } from './live/services/database-handler.service';
import { PlayHomeComponent } from './play/play-home/play-home.component';
import { HomeComponent } from './home/home.component';
import { LiveHomeComponent } from './live/live-home/live-home.component';
import { AboutComponent } from './about/about.component';
import { ModalComponent } from './shared/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    IframeComponent,
    PlayComponent,
    HeaderComponent,
    LiveComponent,
    LiveHomeComponent,
    LiveGameComponent,
    WaitingComponent,
    PlayHomeComponent,
    HomeComponent,
    ModalComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule,
    NgxChessBoardModule.forRoot(),
    NgbModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase()),
    FormsModule,
  ],
  providers: [DatabaseHandler, LiveGameManagerService],

  bootstrap: [AppComponent],
})
export class AppModule {}
