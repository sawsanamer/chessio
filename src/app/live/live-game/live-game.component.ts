import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxChessBoardView } from 'ngx-chess-board';

import { LiveGameManagerService } from '../services/live-game-manager.service';

@Component({
  selector: 'app-live-game',
  templateUrl: './live-game.component.html',
  styleUrls: ['./live-game.component.css'],
})
export class LiveGameComponent implements AfterViewInit {
  boardIsDisabled = false;
  playerId: string = '';
  modalMsg = 'Checkmate detected, game has ended.';

  @ViewChild('board', { static: false })
  board!: NgxChessBoardView;
  newGameModal!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private gameManagerService: LiveGameManagerService
  ) {}

  ngAfterViewInit(): void {
    this.init();
  }

  onModalCreated(modalRef: ElementRef) {
    this.newGameModal = modalRef;
  }
  movePiece(event: any) {
    this.gameManagerService.move(event, this.catchDatabaseError.bind(this));
  }

  private catchDatabaseError(err: any) {
    this.modalMsg = `Error: ${err}`;
    this.gameManagerService.openModal();
  }
  onCloseModal(modal: any) {
    this.quit();
    modal.close();
  }
  quit() {
    this.gameManagerService.quit();
  }
  private init() {
    this.playerId = this.route.snapshot.params['id'];
    let gameCode = this.route.snapshot.params['code'];
    this.renderViewBasedOnId();
    this.gameManagerService.init(
      gameCode,
      this.playerId,
      this.board,
      this.newGameModal,
      this.catchDatabaseError.bind(this)
    );
    this.gameManagerService.boardIsDisabledUpdated.subscribe((val) => {
      this.boardIsDisabled = val;
    });
  }
  private renderViewBasedOnId() {
    if (this.playerId === '2') this.board.reverse();
    this.boardIsDisabled = this.playerId === '1' ? false : true;
  }
}
