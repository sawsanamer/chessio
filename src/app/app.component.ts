import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { BoardSizeService } from './board-size.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  showHeader = true;

  constructor(
    private router: Router,
    private boardSizeService: BoardSizeService
  ) {
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url === '/iframe') this.showHeader = false;
      });

    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    let windowWidth = window.innerWidth;
    if (windowWidth > 400) this.boardSizeService.boardSizeUpdated.emit(400);
    else this.boardSizeService.boardSizeUpdated.emit(windowWidth - 20);
  }
}
