import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LiveGameManagerService } from '../services/live-game-manager.service';

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.css'],
})
export class WaitingComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private gameManagerService: LiveGameManagerService
  ) {}

  gameCode: string = '';
  ngOnInit(): void {
    this.gameCode = this.route.snapshot.params['code'];
    this.gameManagerService.redirectOnJoin();
  }

  quit() {
    this.gameManagerService.deleteGameOnWaiting(this.gameCode);
  }
}
