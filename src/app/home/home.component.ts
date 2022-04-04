import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BoardSizeService } from '../board-size.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(private boardSizeService: BoardSizeService) {}
  ngOnDestroy(): void {
    this.boardSizeSubscription.unsubscribe();
  }
  boardSize = 400;
  boardSizeSubscription!: Subscription;

  ngOnInit(): void {
    this.boardSizeSubscription = this.boardSizeService.boardSize.subscribe(
      (newSize) => {
        this.boardSize = newSize;
      }
    );
  }
}
