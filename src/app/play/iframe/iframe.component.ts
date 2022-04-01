import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { NgxChessBoardView } from 'ngx-chess-board';
import { BoardSizeService } from 'src/app/board-size.service';

@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.css'],
})
export class IframeComponent {
  boardIsDisabled = false;
  boardSize = 400;

  ngOnInit(): void {
    this.boardSizeService.boardSizeUpdated.subscribe((newSize) => {
      this.boardSize = newSize;
    });
  }

  constructor(private boardSizeService: BoardSizeService) {}
  @ViewChild('board', { static: false })
  board!: NgxChessBoardView;

  movePiece(event: any) {
    window.parent.postMessage(event);
  }

  @HostListener('window:message', ['$event'])
  onMessage(event: any) {
    if (window.origin == event.origin) {
      if (event.data.reset) this.board.reset();
      if (event.data.reverse) this.board.reverse();
      if (event.data.boardIsDisabled != undefined)
        this.boardIsDisabled = event.data.boardIsDisabled;
      if (event.data.location) this.board.move(event.data.location);
    }
  }
}
