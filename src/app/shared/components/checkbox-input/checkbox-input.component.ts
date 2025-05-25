import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-checkbox-input',
  imports: [],
  templateUrl: './checkbox-input.component.html',
  styleUrl: './checkbox-input.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CheckboxInputComponent {
  @Input() label!: string;
}
