import { ElementRef, Injectable } from '@angular/core';
@Injectable()
export class IframeManagerService {
  iframe1!: ElementRef;
  iframe2!: ElementRef;

  setIframes(iframe1: ElementRef, iframe2: ElementRef) {
    this.iframe1 = iframe1;
    this.iframe2 = iframe2;
  }

  initIframesWithData(localStorageMoves: string[]) {
    for (let i = 0; i < localStorageMoves.length; i++) {
      this.sendIframe1Message({ location: localStorageMoves[i] });
    }
  }

  initIframe2Direction() {
    this.sendIframe2Message({ reverse: true });
  }

  private sendIframe1Message(object: {}) {
    this.iframe1.nativeElement.contentWindow.postMessage(object);
  }

  private sendIframe2Message(object: {}) {
    this.iframe2.nativeElement.contentWindow.postMessage(object);
  }

  handleIframesOnMove(src: string, location: string, lastColor: string) {
    this.moveOtherIframeBoard(src, location);

    let disableBoard1 = lastColor === 'white' ? true : false;
    let disableBoard2 = lastColor === 'white' ? false : true;

    this.disableIframeBoards(disableBoard1, disableBoard2);
  }

  moveOtherIframeBoard(src: string, location: string) {
    if (src == 'iframe1') {
      this.sendIframe2Message({ location: location });
    } else if (src == 'iframe2') {
      this.sendIframe1Message({ location: location });
    }
  }

  disableIframeBoards(disableBoard1: boolean, disableBoard2: boolean) {
    this.sendIframe1Message({ boardIsDisabled: disableBoard1 });
    this.sendIframe2Message({ boardIsDisabled: disableBoard2 });
  }

  resetIframes() {
    this.iframe1.nativeElement.contentWindow.postMessage({
      reset: true,
      boardIsDisabled: false,
    });
    this.iframe2.nativeElement.contentWindow.postMessage({
      reset: true,
      reverse: true,
      boardIsDisabled: true,
    });
  }
}
