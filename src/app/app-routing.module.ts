import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayComponent } from './play/play.component';
import { IframeComponent } from './play/iframe/iframe.component';
import { LiveComponent } from './live/live.component';
import { LiveGameComponent } from './live/live-game/live-game.component';
import { WaitingComponent } from './live/waiting/waiting.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'live', component: LiveComponent },
  { path: 'play', component: PlayComponent },
  { path: 'iframe', component: IframeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'game/:code/:id', component: LiveGameComponent },
  { path: 'waiting/:code', component: WaitingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
