import { JsonPipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ItemDetailsComponent } from '../item-details/item-details.component';
import { ItemCardComponent } from '../item-card/item-card.component';
import { ItemsService } from '../../items.service';
import { KeyboardArrowDownComponent } from '../../../shared/components/icons/keyboard-arrow-down/keyboard-arrow-down.component';
import { KeyboardArrowUpComponent } from '../../../shared/components/icons/keyboard-arrow-up/keyboard-arrow-up.component';
import { ItemState } from '../../items.interface';

@Component({
  selector: 'app-items-list',
  imports: [
    JsonPipe,
    ItemCardComponent,
    ItemDetailsComponent,
    KeyboardArrowDownComponent,
    KeyboardArrowUpComponent,
  ],
  templateUrl: './items-list.component.html',
  styleUrl: './items-list.component.scss',
})
export class ItemsListComponent implements OnInit {
  @Input({ required: true }) itemState!: ItemState;
  @Output() selectedItem = new EventEmitter<number>();


  constructor(
    private itemsService: ItemsService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
  }

  onSelected(itemOption: number) {
    this.selectedItem.emit(itemOption);
  }


}
