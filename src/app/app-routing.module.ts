import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IframeComponent } from './play/iframe/iframe.component';
import { LiveGameComponent } from './live/live-game/live-game.component';
import { WaitingComponent } from './live/waiting/waiting.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LiveHomeComponent } from './live/live-home/live-home.component';
import { PlayHomeComponent } from './play/play-home/play-home.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'live', component: LiveHomeComponent },
  { path: 'play', component: PlayHomeComponent },
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
