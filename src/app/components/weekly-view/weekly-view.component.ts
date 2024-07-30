import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { EventService } from '@services/event/event.service';

import { EventDialogComponent } from '@components/event-dialog/event-dialog.component';
import { HoursLabelComponent } from '@components/hours-label/hours-label.component';

import { ICalendarEvent } from '@interfaces/event.interface';
import { ClickStopPropagationDirective } from '@directives/click-stop-propagation.directive';

@Component({
  selector: 'cal-weekly-view',
  standalone: true,
  imports: [CommonModule, HoursLabelComponent, ClickStopPropagationDirective],
  templateUrl: './weekly-view.component.html',
  styleUrl: './weekly-view.component.scss',
})
export class WeeklyViewComponent implements OnChanges, OnInit {
  @Input() date: Date = new Date();
  events: ICalendarEvent[] = [];
  daysOfWeek: Date[] = [];

  constructor(
    private readonly eventService: EventService,
    private readonly dialog: MatDialog,
  ) {}

  public ngOnInit(): void {
    this.eventService.getEvents().subscribe((events) => (this.events = events));
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['date'] && this.date) {
      this.daysOfWeek = [];
      this.generateWeek(this.date);
    }
  }

  public onEventClickHandler(event: ICalendarEvent): void {
    this.openEventDialog({ event })
      .afterClosed()
      .subscribe(
        (result: any) =>
          result &&
          this.eventService.updateEvent(result).subscribe(() => {
            const index = this.events.findIndex((e) => e.id === result.id);
            this.events[index] = result;
          }),
      );
  }

  public onContainerClickHandler(date: Date): void {
    this.openEventDialog({ date })
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.eventService.addEvent(result).subscribe();
          this.events.push(result);
          this.events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
        }
      });
  }

  public getEventsForDay(date: Date): ICalendarEvent[] {
    return this.events.filter((event) => new Date(event.start).toDateString() === date.toDateString());
  }

  private generateWeek(date: Date): void {
    const startOfWeek = this.getStartOfWeek(date);
    for (let i = 0; i < 7; i++) this.daysOfWeek.push(new Date(startOfWeek.getTime() + i * 24 * 60 * 60 * 1000));
  }

  private getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);

    return new Date(date.setDate(diff));
  }

  private openEventDialog(data: { event: ICalendarEvent } | { date: Date }): MatDialogRef<EventDialogComponent, ICalendarEvent> {
    return this.dialog.open(EventDialogComponent, { width: '500px', data });
  }
}
