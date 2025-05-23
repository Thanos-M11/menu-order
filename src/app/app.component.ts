import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DollarCurrencyWrapperDirective } from './shared/directives/dollar-currency-wrapper.directive';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DollarCurrencyWrapperDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'pizza-menu';
}
