import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UndoIconComponent } from './undo-icon.component';

describe('UndoIconComponent', () => {
  let component: UndoIconComponent;
  let fixture: ComponentFixture<UndoIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UndoIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UndoIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
