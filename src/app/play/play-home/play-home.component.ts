import {
  Component,
  ViewChild,
  AfterViewInit,
  ElementRef,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { GameStateService } from '../services/game-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BoardSizeService } from 'src/app/board-size.service';
import { Subscription } from 'rxjs';
import { IframeManagerService } from '../services/iframe-manager.service';

@Component({
  selector: 'app-play-home',
  templateUrl: './play-home.component.html',
  styleUrls: ['./play-home.component.css'],
  providers: [GameStateService, IframeManagerService],
})
export class PlayHomeComponent implements AfterViewInit, OnDestroy {
  iframeSize = '430px';
  boardSizeSubscription!: Subscription;
  @ViewChild('iframe1', { static: false })
  iframe1!: ElementRef;
  @ViewChild('iframe2', { static: false })
  iframe2!: ElementRef;
  newGameModal!: ElementRef;

  constructor(
    private gameStateService: GameStateService,
    private modalService: NgbModal,
    private boardSizeService: BoardSizeService
  ) {}

  ngOnInit(): void {
    this.boardSizeSubscription = this.boardSizeService.boardSize.subscribe(
      (newBoardSize) => {
        this.iframeSize = (newBoardSize + 30).toString() + 'px';
      }
    );
  }

  ngAfterViewInit(): void {
    this.gameStateService.setGameData(this.iframe1, this.iframe2);
  }
  onIframe1Load() {
    this.gameStateService.initGameFromLocalStorage();
  }
  onIframe2Load() {
    this.gameStateService.setIframe2Info();
  }
  @HostListener('window:message', ['$event'])
  onMessage(event: any) {
    if (window.origin == event.origin) {
      if (event.data.check === true) this.openNewGameModal();
      else {
        if (event.source === this.iframe1.nativeElement.contentWindow) {
          this.onMove(event.data, 'iframe1');
        } else this.onMove(event.data, 'iframe2');
      }
    }
  }

  openNewGameModal() {
    this.modalService.open(this.newGameModal, {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      keyboard: true,
    });
  }
  onModalCreated(modalRef: ElementRef) {
    this.newGameModal = modalRef;
  }
  onCloseModal(modal: any) {
    this.resetGame();
    modal.close();
  }
  resetGame() {
    this.gameStateService.reset();
  }

  onMove(e: any, src: string) {
    this.gameStateService.onMove(e.move, src, e.color);
  }

  reset() {
    this.gameStateService.reset();
  }

  ngOnDestroy(): void {
    this.boardSizeSubscription.unsubscribe();
  }
}
