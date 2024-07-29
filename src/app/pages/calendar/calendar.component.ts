import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { MatLineModule } from '@angular/material/core';

import { DailyViewComponent } from '@components/daily-view/daily-view.component';

@Component({
  selector: 'cal-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatDatepickerModule, MatListModule, MatLineModule, DailyViewComponent],
  standalone: true,
})
export class CalendarComponent {
  public selectedDate: Date = new Date();

  public onDateChangeHandler(date: Date): void {
    this.selectedDate = date;
  }

  public onNavigateForwardHandler(): void {
    this.selectedDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate() + 1);
  }

  public onNavigateBackHandler(): void {
    this.selectedDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate() - 1);
  }
}
