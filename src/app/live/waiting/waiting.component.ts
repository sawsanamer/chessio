import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LiveGameManagerService } from '../services/live-game-manager.service';

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.css'],
})
export class WaitingComponent implements OnInit, OnDestroy {
  gameCode: string = '';

  constructor(
    private route: ActivatedRoute,
    private gameManagerService: LiveGameManagerService
  ) {}
  ngOnInit(): void {
    this.gameCode = this.route.snapshot.params['code'];
    this.gameManagerService.redirectOnJoin();
  }

  quit() {
    this.gameManagerService.deleteGameOnWaiting(this.gameCode);
  }
  ngOnDestroy() {
    this.gameManagerService.onWaitingDestroy();
  }
}
