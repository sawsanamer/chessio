import { Injectable } from '@angular/core';
import {
  child,
  Database,
  get,
  onValue,
  push,
  ref,
  remove,
  update,
} from '@angular/fire/database';

@Injectable()
export class DatabaseHandler {
  constructor(private db: Database) {}

  createGame(onCreateGame: Function, onDatabaseError: Function) {
    return push(ref(this.db, 'games'), {
      player2Joined: false,
    })
      .then((data: any) => {
        let gameCode = data._path.pieces_[1];
        onCreateGame(gameCode);
      })
      .catch((err) => onDatabaseError(err.message));
  }

  getGameCode(
    gameCode: string,
    onGameCodeExists: Function,
    onGameCodeDoesNotExist: Function,
    onDatabaseError: Function
  ) {
    get(child(ref(this.db), `games/${gameCode}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          onGameCodeExists();
        } else {
          onGameCodeDoesNotExist();
        }
      })
      .catch((err) => {
        onDatabaseError(err.message);
      });
  }

  getPlayer2JoinedState(gameCode: string, onPlayer2Joined: Function) {
    const starCountRef = ref(this.db, 'games/' + gameCode + '/player2Joined');
    onValue(starCountRef, (snapshot) => {
      const player2Joined = snapshot.val();
      if (player2Joined) onPlayer2Joined();
    });
  }

  getGameData(gameCode: string, onFetch: Function, onDatabaseError: Function) {
    const movesRef = ref(this.db, 'games/' + gameCode);
    onValue(
      movesRef,
      (snapshot) => {
        let data = snapshot.val();
        onFetch(data);
      },
      (err) => {
        onDatabaseError(err.message);
      }
    );
  }

  getGameEndedStatus(gameCode: string, onGameEnded: Function) {
    const starCountRef = ref(this.db, 'games/' + gameCode + '/gameEnded');
    onValue(starCountRef, (snapshot) => {
      const gameEnded = snapshot.val();
      if (gameEnded) {
        onGameEnded();
      }
    });
  }

  updatePlayer2Joined(
    gameCode: string,
    value: boolean,
    onUpdatePlayer2Joined: Function
  ) {
    return update(ref(this.db, `games/${gameCode}`), {
      player2Joined: value,
    }).then(() => {
      onUpdatePlayer2Joined();
    });
  }

  updateGameData(gameCode: string, data: any, onDatabaseError: Function) {
    return update(ref(this.db, `games/${gameCode}`), data).catch((err) => {
      onDatabaseError(err.message);
    });
  }

  deleteGame(gameCode: string) {
    remove(ref(this.db, `games/${gameCode}`));
  }
}
