import { EventEmitter, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BoardSizeService {
  constructor() {}

  boardSizeUpdated = new EventEmitter<number>();
}
