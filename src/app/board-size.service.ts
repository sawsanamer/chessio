import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class BoardSizeService {
  constructor() {}

  boardSizeUpdated = new EventEmitter<number>();
}
