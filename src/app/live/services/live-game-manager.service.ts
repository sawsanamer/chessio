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

  quit() {
    this.databaseHandler.updateGameData(
      this.gameCode,
      { gameEnded: true },
      () => {}
    );
    this.moves = [];
    this.router.navigate([`/live`]);
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
          this.router.navigate([`/game/${gameCode}/2`]);
        });
      },
      onWrongInput,
      onDatabaseError
    );
  }

  navigateToGame(onDatabaseError: Function) {
    this.databaseHandler.createGame((gameCode: string) => {
      this.gameCode = gameCode;
      this.router.navigate([`/waiting/${gameCode}`]);
    }, onDatabaseError);
  }

  redirectOnJoin() {
    this.databaseHandler.getPlayer2JoinedState(this.gameCode, () => {
      this.router.navigate([`/game/${this.gameCode}/1`]);
    });
  }

  private checkIfGameEnded() {
    this.databaseHandler.getGameEndedStatus(this.gameCode, () => {
      this.databaseHandler.deleteGame(this.gameCode);
      this.router.navigate([`/live`]);
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

  private subscribeToGameData(onDatabaseError: Function) {
    this.resetNewMove(onDatabaseError)
      .then(() => {
        this.databaseHandler.getGameData(
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
