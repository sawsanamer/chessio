import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxChessBoardView } from 'ngx-chess-board';
import { BoardSizeService } from 'src/app/board-size.service';

import { LiveGameManagerService } from '../services/live-game-manager.service';

@Component({
  selector: 'app-live-game',
  templateUrl: './live-game.component.html',
  styleUrls: ['./live-game.component.css'],
})
export class LiveGameComponent implements AfterViewInit, OnDestroy {
  boardIsDisabled = false;
  playerId: string = '';
  modalMsg = 'Game has ended.';

  @ViewChild('board', { static: false })
  board!: NgxChessBoardView;
  newGameModal!: ElementRef;

  boardSize = 400;

  ngOnInit(): void {
    this.boardSizeService.boardSizeUpdated.subscribe((newBoardSize) => {
      this.boardSize = newBoardSize;
    });
  }

  constructor(
    private route: ActivatedRoute,
    private gameManagerService: LiveGameManagerService,
    private boardSizeService: BoardSizeService
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
    modal.close();
  }
  quit() {
    this.gameManagerService.quit();
  }

  ngOnDestroy(): void {
    this.gameManagerService.onGameDestroy();
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
