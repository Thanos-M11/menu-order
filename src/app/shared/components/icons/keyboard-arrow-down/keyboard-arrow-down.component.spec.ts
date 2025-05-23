import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyboardArrowDownComponent } from './keyboard-arrow-down.component';

describe('KeyboardArrowDownComponent', () => {
  let component: KeyboardArrowDownComponent;
  let fixture: ComponentFixture<KeyboardArrowDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyboardArrowDownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeyboardArrowDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
