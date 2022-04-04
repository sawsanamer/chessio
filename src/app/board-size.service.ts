import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BoardSizeService {
  constructor() {}

  private boardSizeUpdated = new BehaviorSubject(400);

  boardSize = this.boardSizeUpdated.asObservable();

  onSizeChange(newSize: number) {
    this.boardSizeUpdated.next(newSize);
  }
}
