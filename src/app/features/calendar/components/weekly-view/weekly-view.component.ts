import { BehaviorSubject, map, Observable } from "rxjs";

import { CommonModule } from "@angular/common";
import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

import { EventService } from "@services/event/event.service";

import { EventDialogComponent } from "@features/calendar/components/event-dialog/event-dialog.component";
import { HoursLabelComponent } from "@features/calendar/containers/hours-label/hours-label.component";

import { ClickStopPropagationDirective } from "@directives/click-stop-propagation.directive";

import { CalendarEvent } from "@interfaces/event.interface";

@Component({
  selector: "cal-weekly-view",
  standalone: true,
  imports: [CommonModule, HoursLabelComponent, ClickStopPropagationDirective],
  templateUrl: "./weekly-view.component.html",
  styleUrl: "./weekly-view.component.scss",
})
export class WeeklyViewComponent implements OnChanges, OnInit {
  @Input() public date: Date = new Date();

  public daysOfWeek: Date[] = [];

  private eventsSubject = new BehaviorSubject<CalendarEvent[]>([]);

  public get events$(): Observable<CalendarEvent[]> {
    return this.eventsSubject.asObservable();
  }

  constructor(
    private readonly eventService: EventService,
    private readonly dialog: MatDialog,
  ) {}

  public ngOnInit(): void {
    this.getEvents();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const { date } = changes;
    if (date && this.date) this.generateWeek(this.date);
  }

  public onEventClickHandler(event: CalendarEvent): void {
    this.openEventDialog({ event })
      .afterClosed()
      .subscribe(
        (result?: CalendarEvent) =>
          result &&
          this.eventService.updateEvent(result).subscribe(() => {
            const events = this.eventsSubject.value;
            const index = events.findIndex((e) => e.id === result.id);

            events[index] = result;
            this.eventsSubject.next(events);
          }),
      );
  }

  public onContainerClickHandler(date: Date): void {
    this.openEventDialog({ date })
      .afterClosed()
      .subscribe((result?: CalendarEvent) => {
        if (result) {
          const events = this.eventsSubject.value;
          this.eventService.addEvent(result).subscribe();
          events.push(result);
          events.sort(
            (a: CalendarEvent, b: CalendarEvent) => new Date(a.start).getTime() - new Date(b.start).getTime(),
          );
          this.eventsSubject.next(events);
        }
      });
  }

  public getEventsForDay(date: Date): Observable<CalendarEvent[]> {
    return this.events$.pipe(
      map((events) => events.filter((event) => new Date(event.start).toDateString() === date.toDateString())),
    );
  }

  private generateWeek(date: Date): void {
    this.daysOfWeek = [];
    const startOfWeek = this.getStartOfWeek(date);
    for (let i = 0; i < 7; i++) this.daysOfWeek.push(new Date(startOfWeek.getTime() + i * 24 * 60 * 60 * 1000));
  }

  private getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);

    return new Date(date.setDate(diff));
  }

  private openEventDialog(
    data: { event: CalendarEvent } | { date: Date },
  ): MatDialogRef<EventDialogComponent, CalendarEvent> {
    return this.dialog.open(EventDialogComponent, { width: "500px", data });
  }

  private getEvents(): void {
    this.eventService.getEvents().subscribe((events: CalendarEvent[]) => this.eventsSubject.next(events));
  }
}
