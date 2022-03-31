import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit, AfterViewInit {
  @Input('message')
  message!: string;
  @Input('buttonText')
  buttonText!: string;
  @Input('onButtonClick')
  onButtonClick!: Function;
  @Output() modalCreated = new EventEmitter<ElementRef>();
  @ViewChild('modal', { static: true })
  modal!: ElementRef;
  constructor() {}
  ngAfterViewInit(): void {
    this.modalCreated.emit(this.modal);
  }

  ngOnInit(): void {}
}
