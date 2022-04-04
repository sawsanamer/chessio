import { ElementRef, Injectable } from '@angular/core';
import { IframeManagerService } from './iframe-manager.service';
@Injectable()
export class GameStateService {
  constructor(private iframeManagerService: IframeManagerService) {}
  moves: string[] = [];
  localStorageItems: string[] = [];

  onMove(location: any, src: string, lastColor: string) {
    if (
      location != null &&
      (this.moves.length == 0 || !this.moves.includes(location))
    ) {
      this.moves.push(location);
      localStorage.setItem('moves', JSON.stringify(this.moves));
      this.iframeManagerService.handleIframesOnMove(src, location, lastColor);
    }
  }

  private setIframes(iframe1: ElementRef, iframe2: ElementRef) {
    this.iframeManagerService.setIframes(iframe1, iframe2);
  }

  private setLocalStorageData() {
    this.localStorageItems = JSON.parse(localStorage.getItem('moves') || '[]');
  }

  initGameFromLocalStorage() {
    this.iframeManagerService.initIframesWithData(this.localStorageItems);
  }

  setGameData(iframe1: ElementRef, iframe2: ElementRef) {
    this.setIframes(iframe1, iframe2);
    this.setLocalStorageData();
  }

  setIframe2Info() {
    this.iframeManagerService.initIframe2Direction();
    if (this.localStorageItems.length == 0) {
      this.iframeManagerService.disableIframeBoards(false, true);
    }
  }

  reset() {
    this.iframeManagerService.resetIframes();
    this.moves = [];
    localStorage.removeItem('moves');
  }
}
