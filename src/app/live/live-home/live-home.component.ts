import { Component, ElementRef } from '@angular/core';
import { LiveGameManagerService } from '../services/live-game-manager.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-live-home',
  templateUrl: './live-home.component.html',
  styleUrls: ['./live-home.component.css'],
})
export class LiveHomeComponent {
  constructor(
    private gameManagerService: LiveGameManagerService,
    private modalService: NgbModal
  ) {}

  errorMsg = '';
  errorModal!: ElementRef;

  onModalCreated(modalRef: ElementRef) {
    this.errorModal = modalRef;
  }

  onCloseModal(modal: any) {
    modal.close();
  }

  joinGame(gameCode: string) {
    this.gameManagerService.joinGame(
      gameCode,
      this.onJoinGameError.bind(this),
      this.onDatabaseError.bind(this)
    );
  }
  onJoinGameError() {
    this.errorMsg = 'Error: Game Does not exist';
    this.openErrorModal();
  }

  onDatabaseError(err: any) {
    this.errorMsg = `Error: ${err}`;
    this.openErrorModal();
  }

  openErrorModal() {
    if (!this.modalService.hasOpenModals()) {
      this.modalService.open(this.errorModal, {
        ariaLabelledBy: 'modal-basic-title',
        backdrop: 'static',
        keyboard: true,
      });
    }
  }
  createGame() {
    this.gameManagerService.navigateToGame(this.onDatabaseError.bind(this));
  }
}
