import { Component, OnInit } from '@angular/core';
import { BoardSizeService } from '../board-size.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private boardSizeService: BoardSizeService) {}
  boardSize = 400;

  ngOnInit(): void {
    this.boardSizeService.boardSizeUpdated.subscribe((newSize) => {
      this.boardSize = newSize;
    });
  }
}
