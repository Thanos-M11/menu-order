import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyboardArrowUpComponent } from './keyboard-arrow-up.component';

describe('KeyboardArrowUpComponent', () => {
  let component: KeyboardArrowUpComponent;
  let fixture: ComponentFixture<KeyboardArrowUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyboardArrowUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeyboardArrowUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
