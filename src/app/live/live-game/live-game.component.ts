import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxChessBoardView } from 'ngx-chess-board';
import { Subscription } from 'rxjs';
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
  boardIsDisabledSubscription!: Subscription;
  boardSizeSubscription!: Subscription;
  @ViewChild('board', { static: false })
  board!: NgxChessBoardView;
  newGameModal!: ElementRef;
  constructor(
    private route: ActivatedRoute,
    private gameManagerService: LiveGameManagerService,
    private boardSizeService: BoardSizeService
  ) {}

  boardSize = 400;

  ngOnInit(): void {
    this.boardSizeSubscription = this.boardSizeService.boardSize.subscribe(
      (newBoardSize) => {
        this.boardSize = newBoardSize;
      }
    );
  }

  ngAfterViewInit(): void {
    this.init();
  }

  onModalCreated(modalRef: ElementRef) {
    this.newGameModal = modalRef;
  }
  movePiece(event: any) {
    this.gameManagerService.move(event, this.catchDatabaseError.bind(this));
  }

  onCloseModal(modal: any) {
    modal.close();
  }
  quit() {
    this.gameManagerService.quit();
  }

  ngOnDestroy(): void {
    this.gameManagerService.onGameDestroy();
    this.boardSizeSubscription.unsubscribe();
    this.boardIsDisabledSubscription.unsubscribe();
  }
  private catchDatabaseError(err: any) {
    this.modalMsg = `Error: ${err}`;
    this.gameManagerService.openModal();
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
    this.boardIsDisabledSubscription =
      this.gameManagerService.boardIsDisabled.subscribe((val) => {
        this.boardIsDisabled = val;
      });
  }
  private renderViewBasedOnId() {
    if (this.playerId === '2') this.board.reverse();
  }
}
