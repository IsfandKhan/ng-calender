import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoursLabelComponent } from './hours-label.component';

describe('HoursLabelComponent', () => {
  let component: HoursLabelComponent;
  let fixture: ComponentFixture<HoursLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoursLabelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HoursLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
