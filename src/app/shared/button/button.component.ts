import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent implements OnInit {
  @Input() style: any;
  @Input() type: any;
  @Input() route: any;
  @Input() text: any;
  @Input() isFeatured: any;
  @Output() buttonClicked: EventEmitter<any> = new EventEmitter();

  onButtonClick() {
    this.buttonClicked.emit();
  }

  constructor() {}

  ngOnInit(): void {}
}
