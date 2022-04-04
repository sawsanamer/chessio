import { ElementRef, EventEmitter, Injectable } from '@angular/core';
import { DatabaseReference } from '@angular/fire/database';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxChessBoardView } from 'ngx-chess-board';
import { DatabaseHandlerService } from './database-handler.service';

@Injectable({ providedIn: 'root' })
export class LiveGameManagerService {
  constructor(
    private databaseHandler: DatabaseHandlerService,
    private router: Router,
    private modalService: NgbModal
  ) {}
  boardIsDisabledUpdated = new EventEmitter<boolean>();

  gameCode: string = '';
  moves: string[] = [];
  playerId: string = '';
  boardIsDisabled = false;

  gameDataRef: DatabaseReference | undefined;
  player2JoinedRef: DatabaseReference | undefined;
  board!: NgxChessBoardView;
  modal!: ElementRef;

  init(
    gameCode: string,
    playerId: string,
    board: NgxChessBoardView,
    modal: ElementRef,
    onDatabaseError: Function
  ) {
    this.setDataOnStartup(gameCode, playerId, board, modal);
    this.subscribeToGameData(onDatabaseError);
  }

  move(event: any, onDatabaseError: Function) {
    if (!this.moves.includes(event.move)) {
      this.moves.push(event.move);
      let newMove = event.move;
      let check = event.check;
      this.databaseHandler.updateGameData(
        this.gameCode,
        {
          moves: this.moves,
          newMove: newMove,
          check: check,
        },
        onDatabaseError
      );
    }
  }

  deleteGameOnWaiting(gameCode: string) {
    this.databaseHandler.deleteGame(gameCode);
    this.onGameFinished();
  }

  joinGame(
    gameCode: string,
    onWrongInput: Function,
    onDatabaseError: Function
  ) {
    this.databaseHandler.getGameCode(
      gameCode,
      () => {
        this.databaseHandler.updatePlayer2Joined(gameCode, true, () => {
          this.setLocalStorage(gameCode, '2');
          this.router.navigate([`/game/${gameCode}/2`]);
        });
      },
      onWrongInput,
      onDatabaseError
    );
  }

  createGame(onDatabaseError: Function) {
    this.databaseHandler.createGame((gameCode: string) => {
      this.gameCode = gameCode;
      this.setLocalStorage(gameCode, '1');
      this.router.navigate([`/waiting/${gameCode}`]);
    }, onDatabaseError);
  }

  redirectOnJoin() {
    this.player2JoinedRef = this.databaseHandler.subscribeToPlayer2JoinedState(
      this.gameCode,
      () => {
        this.router.navigate([`/game/${this.gameCode}/1`]);
      }
    );
  }

  openModal() {
    if (!this.modalService.hasOpenModals()) {
      this.modalService.open(this.modal, {
        ariaLabelledBy: 'modal-basic-title',
        backdrop: 'static',
        keyboard: true,
      });
    }
  }
  quit() {
    this.databaseHandler.updateGameData(
      this.gameCode,
      { check: true },
      () => {}
    );
  }
  async checkIfGameExists(catchDatabaseError: Function) {
    let gameCode = localStorage.getItem('gameCode');
    let player = localStorage.getItem('player');
    if (player === '1') {
      try {
        let player2Joined = await this.databaseHandler.getPlayer2JoinedState(
          gameCode
        );
        if (player2Joined) this.router.navigate([`/game/${gameCode}/1`]);
        else this.router.navigate([`/waiting/${gameCode}`]);
      } catch (err) {
        catchDatabaseError(err);
      }
    } else if (player === '2') this.router.navigate([`/game/${gameCode}/2`]);
  }

  private setDataOnStartup(
    gameCode: string,
    playerID: string,
    board: NgxChessBoardView,
    modal: ElementRef
  ) {
    this.gameCode = gameCode;
    this.playerId = playerID;
    this.board = board;
    this.modal = modal;
  }

  private setLocalStorage(gameCode: string, player: string) {
    localStorage.setItem('gameCode', gameCode);
    localStorage.setItem('player', player);
  }
  private resetLocalStorage() {
    localStorage.removeItem('gameCode');
    localStorage.removeItem('player');
  }

  private onGameFinished() {
    this.moves = [];
    this.resetLocalStorage();
    this.router.navigate([`/live`]);
  }

  private subscribeToGameData(onDatabaseError: Function) {
    this.resetNewMove(onDatabaseError)
      .then(() => {
        this.gameDataRef = this.databaseHandler.subscribeToGameData(
          this.gameCode,
          this.handleGameDataChanges.bind(this),
          onDatabaseError
        );
      })
      .catch((err) => {
        onDatabaseError(err.message);
      });
  }
  onGameDestroy() {
    this.databaseHandler.unSubscribeToGameData(this.gameDataRef);
  }

  onWaitingDestroy() {
    this.databaseHandler.unsubscribeToPlayer2JoinedState(this.player2JoinedRef);
  }
  private resetNewMove(onDatabaseError: Function) {
    return this.databaseHandler.updateGameData(
      this.gameCode,
      { newMove: '' },
      onDatabaseError
    );
  }

  private disableOtherBoard() {
    if (
      (this.moves.length % 2 === 0 && this.playerId === '2') ||
      (this.moves.length % 2 !== 0 && this.playerId === '1')
    ) {
      this.boardIsDisabled = true;
    } else this.boardIsDisabled = false;
    this.boardIsDisabledUpdated.emit(this.boardIsDisabled);
  }

  private onGameEnded() {
    this.databaseHandler.deleteGame(this.gameCode);
    this.onGameFinished();
    this.openModal();
  }

  private handleGameDataChanges(gameData: any) {
    let moves = gameData.moves;
    let newMove = gameData.newMove;
    let check = gameData.check;

    if (check) {
      this.onGameEnded();
    } else if (moves) {
      if (newMove && !this.moves.includes(newMove)) {
        this.moves.push(newMove);
        this.board.move(newMove);
      } else if (newMove === '') {
        for (let i = 0; i < moves.length; i++) {
          this.board.move(moves[i]);
        }
      }
      this.disableOtherBoard();
    }
  }
}
