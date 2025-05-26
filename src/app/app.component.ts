import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ItemCardFormComponent } from './items/components/item-card-form/item-card-form.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'pizza-menu';
}
