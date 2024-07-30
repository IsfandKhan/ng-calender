import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatListModule } from "@angular/material/list";
import { MatLineModule } from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";

import { DailyViewComponent } from "@features/calendar/components/daily-view/daily-view.component";
import { WeeklyViewComponent } from "@features/calendar/components/weekly-view/weekly-view.component";

import { CALENDAR_VIEWS } from "@utils/constants";

@Component({
  selector: "cal-calendar",
  templateUrl: "./calendar.component.html",
  styleUrl: "./calendar.component.scss",
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatDatepickerModule,
    MatListModule,
    MatLineModule,
    MatButtonModule,
    DailyViewComponent,
    WeeklyViewComponent,
  ],
  standalone: true,
})
export class CalendarComponent {
  public selectedDate: Date = new Date();
  public CALENDAR_VIEWS = CALENDAR_VIEWS;
  public selectedView = CALENDAR_VIEWS.DAILY;

  public onDateChangeHandler(date: Date): void {
    this.selectedDate = date;
  }

  public onNavigateForwardHandler(): void {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      this.selectedDate.getDate() + 1,
    );
  }

  public onNavigateBackHandler(): void {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      this.selectedDate.getDate() - 1,
    );
  }

  public toggleView(): void {
    this.selectedView = this.selectedView === CALENDAR_VIEWS.DAILY ? CALENDAR_VIEWS.WEEKLY : CALENDAR_VIEWS.DAILY;
    this.selectedDate = new Date(this.selectedDate);
  }
}
