import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-number-input',
  imports: [],
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class NumberInputComponent {
  @Input() symbol: string = '$';
}
