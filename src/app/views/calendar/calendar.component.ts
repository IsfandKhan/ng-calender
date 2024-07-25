import { map, Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { MatLineModule } from '@angular/material/core';

import { EventService } from '@services/event/event.service';

import { DailyViewComponent } from '@views/daily-view/daily-view.component';
import { EventDialogComponent } from '@views/event-dialog/event-dialog.component';

import { ITimeOfDay } from '@interfaces/common.interface';
import { ICalendarEvent } from '@interfaces/event.interface';

@Component({
  selector: 'cal-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatDatepickerModule, MatListModule, MatLineModule, DailyViewComponent],
  standalone: true,
})
export class CalendarComponent implements OnInit {
  public events$!: Observable<ICalendarEvent[]>;
  public selectedDate: Date = new Date();

  constructor(
    private readonly eventService: EventService,
    private readonly dialog: MatDialog,
  ) {}

  public ngOnInit(): void {
    this.loadEvents();
  }

  public onDateChangeHandler(date: Date): void {
    this.selectedDate = date;
    this.loadEvents();
  }

  public onEventClickHandler(event: ICalendarEvent): void {
    this.dialog
      .open(EventDialogComponent, { width: '300px', data: { event } })
      .afterClosed()
      .subscribe((result) => result && this.eventService.updateEvent(result).subscribe(() => this.loadEvents()));
  }

  public onEventsContainerClickHandler(time: ITimeOfDay): void {
    const date = new Date(this.selectedDate);

    date.setHours(time.hours, time.minutes, 0, 0);
    this.openEventDialog(date);
  }

  public onNavigateForwardHandler(): void {
    this.selectedDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate() + 1);
    this.loadEvents();
  }

  public onNavigateBackHandler(): void {
    this.selectedDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate() - 1);
    this.loadEvents();
  }

  public onReloadEventsHandler(): void {
    this.loadEvents();
  }

  private loadEvents(): void {
    this.events$ = this.eventService
      .getEvents()
      .pipe(map((events) => events.filter((event) => event.start.toDateString() === this.selectedDate.toDateString())));
  }

  private openEventDialog(date: Date): void {
    this.dialog
      .open(EventDialogComponent, { width: '500px', data: { date } })
      .afterClosed()
      .subscribe((result) => result && this.eventService.addEvent(result).subscribe(() => this.loadEvents()));
  }
}
