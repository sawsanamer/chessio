import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChessBoardModule } from 'ngx-chess-board';
import { AppComponent } from './app.component';
import { IframeComponent } from './play/iframe/iframe.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { LiveGameComponent } from './live/live-game/live-game.component';
import { WaitingComponent } from './live/waiting/waiting.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { FormsModule } from '@angular/forms';
import { PlayHomeComponent } from './play/play-home/play-home.component';
import { HomeComponent } from './home/home.component';
import { LiveHomeComponent } from './live/live-home/live-home.component';
import { AboutComponent } from './about/about.component';
import { ModalComponent } from './shared/modal/modal.component';
import { ButtonComponent } from './shared/button/button.component';

@NgModule({
  declarations: [
    AppComponent,
    IframeComponent,
    HeaderComponent,
    LiveHomeComponent,
    LiveGameComponent,
    WaitingComponent,
    PlayHomeComponent,
    HomeComponent,
    ModalComponent,
    AboutComponent,
    ButtonComponent,
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

  bootstrap: [AppComponent],
})
export class AppModule {}
