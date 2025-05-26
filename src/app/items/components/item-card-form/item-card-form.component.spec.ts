import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCardFormComponent } from './item-card-form.component';

describe('ItemCardFormComponent', () => {
  let component: ItemCardFormComponent;
  let fixture: ComponentFixture<ItemCardFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemCardFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemCardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
