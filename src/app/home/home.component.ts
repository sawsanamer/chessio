import { Component, HostListener, OnInit } from '@angular/core';
import { BoardSizeService } from '../board-size.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  boardSize = 400;
  constructor(private boardSizeService: BoardSizeService) {}

  ngOnInit(): void {
    this.boardSizeService.boardSizeUpdated.subscribe((newSize) => {
      this.boardSize = newSize;
    });
  }
}
