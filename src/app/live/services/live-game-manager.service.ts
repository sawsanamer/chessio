import { ElementRef, EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxChessBoardView } from 'ngx-chess-board';
import { DatabaseHandler } from './database-handler.service';

@Injectable()
export class LiveGameManagerService {
  constructor(
    private databaseHandler: DatabaseHandler,
    private router: Router,
    private modalService: NgbModal
  ) {}
  boardIsDisabledUpdated = new EventEmitter<boolean>();

  gameCode: string = '';
  moves: string[] = [];
  newMove = '';
  playerId: string = '';
  board!: NgxChessBoardView;
  modal!: ElementRef;
  boardIsDisabled = false;

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

  init(
    gameCode: string,
    playerId: string,
    board: NgxChessBoardView,
    modal: ElementRef,
    onDatabaseError: Function
  ) {
    this.setDataOnStartup(gameCode, playerId, board, modal);
    this.checkIfGameEnded();
    this.subscribeToGameData(onDatabaseError);
  }

  move(event: any, onDatabaseError: Function) {
    let newMoves = this.moves;
    if (!newMoves.includes(event.move)) {
      newMoves.push(event.move);
      this.newMove = event.move;
      let check = event.check;
      this.databaseHandler.updateGameData(
        this.gameCode,
        {
          moves: newMoves,
          newMove: this.newMove,
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

  quit() {
    this.databaseHandler.updateGameData(
      this.gameCode,
      { gameEnded: true },
      () => {}
    );
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
          localStorage.setItem('gameCode', gameCode);
          localStorage.setItem('player', '2');
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
      localStorage.setItem('gameCode', gameCode);
      localStorage.setItem('player', '1');
      this.router.navigate([`/waiting/${gameCode}`]);
    }, onDatabaseError);
  }

  redirectOnJoin() {
    this.databaseHandler.subscribeToPlayer2JoinedState(this.gameCode, () => {
      this.router.navigate([`/game/${this.gameCode}/1`]);
    });
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
  async checkIfGameExists(catchDatabaseError: Function) {
    let gameCode = localStorage.getItem('gameCode');
    let player = localStorage.getItem('player');
    if (player == '1') {
      try {
        let player2Joined = await this.databaseHandler.getPlayer2JoinedState(
          gameCode
        );
        if (player2Joined)
          this.router.navigate([`/game/${gameCode}/${player}`]);
        else this.router.navigate([`/waiting/${gameCode}`]);
      } catch (err) {
        catchDatabaseError(err);
      }
    } else if (player == '2')
      this.router.navigate([`/game/${gameCode}/${player}`]);
  }

  private resetLocalStorage() {
    localStorage.removeItem('gameCode');
    localStorage.removeItem('player');
  }
  private checkIfGameEnded() {
    this.databaseHandler.subscribeToGameEndedStatus(this.gameCode, () => {
      this.databaseHandler.deleteGame(this.gameCode);
      this.onGameFinished();
    });
  }
  private onGameFinished() {
    this.moves = [];
    this.resetLocalStorage();
    this.router.navigate([`/live`]);
  }

  private subscribeToGameData(onDatabaseError: Function) {
    this.resetNewMove(onDatabaseError)
      .then(() => {
        this.databaseHandler.subscribeToGameData(
          this.gameCode,
          (gameData: any) => {
            this.handleGameDataChanges(gameData);
          },
          onDatabaseError
        );
      })
      .catch((err) => {
        onDatabaseError(err.message);
      });
  }

  private resetNewMove(onDatabaseError: Function) {
    return this.databaseHandler.updateGameData(
      this.gameCode,
      { newMove: '' },
      onDatabaseError
    );
  }

  private handleGameDataChanges(gameData: any) {
    let moves = gameData.moves;
    let newMove = gameData.newMove;
    let check = gameData.check;

    if (moves) {
      this.moves = moves;
      if (newMove) this.board.move(newMove);
      if (check) {
        this.openModal();
      } else {
        for (let i = 0; i < moves.length; i++) {
          this.board.move(moves[i]);
        }
      }
      if (
        (moves.length % 2 === 0 && this.playerId === '2') ||
        (moves.length % 2 !== 0 && this.playerId === '1')
      ) {
        this.boardIsDisabled = true;
      } else this.boardIsDisabled = false;
      this.boardIsDisabledUpdated.emit(this.boardIsDisabled);
    }
  }
}
