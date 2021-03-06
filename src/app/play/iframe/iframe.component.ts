import { Component, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { NgxChessBoardView } from 'ngx-chess-board';
import { Subscription } from 'rxjs';
import { BoardSizeService } from 'src/app/board-size.service';

@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.css'],
})
export class IframeComponent implements OnDestroy {
  boardIsDisabled = false;
  boardSize = 400;
  boardSizeSubscription!: Subscription;
  @ViewChild('board', { static: false })
  board!: NgxChessBoardView;

  constructor(private boardSizeService: BoardSizeService) {}

  ngOnInit(): void {
    this.boardSizeSubscription = this.boardSizeService.boardSize.subscribe(
      (newSize) => {
        this.boardSize = newSize;
      }
    );
  }

  movePiece(event: any) {
    window.parent.postMessage(event);
  }

  ngOnDestroy(): void {
    this.boardSizeSubscription.unsubscribe();
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
