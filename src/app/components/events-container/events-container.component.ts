import { ReplaySubject, map, Observable, delay } from 'rxjs';

import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { EventService } from '@services/event/event.service';

import { EventDialogComponent, EventDialogDataType } from '@components/event-dialog/event-dialog.component';

import { ClickStopPropagationDirective } from '@directives/click-stop-propagation.directive';

import { IEventStyle } from '@interfaces/common.interface';
import { ICalendarEvent } from '@interfaces/event.interface';

import { calculateClickedHourAndMinute, getEventStyle, HOURS_IN_A_DAY } from '@utils/utils';

@Component({
  selector: 'cal-events-container',
  templateUrl: './events-container.component.html',
  styleUrl: './events-container.component.scss',
  imports: [CommonModule, DragDropModule, ClickStopPropagationDirective, MatProgressSpinnerModule],
  standalone: true,
})
export class EventsContainerComponent implements OnChanges, OnDestroy {
  @Input() public eventsContainerHeight!: number;
  @Input() public date!: Date;

  private eventsSubject: ReplaySubject<ICalendarEvent[]> = new ReplaySubject(1);
  private dragEvent: ICalendarEvent | null = null;

  public get events$(): Observable<ICalendarEvent[]> {
    return this.eventsSubject.asObservable();
  }

  constructor(private readonly eventService: EventService, private readonly dialog: MatDialog) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['date'] && this.date) this.loadEvents();
  }

  public ngOnDestroy(): void {
    this.eventsSubject.complete();
    this.eventsSubject.complete();
  }

  public getEventStyle(event: ICalendarEvent): IEventStyle {
    return getEventStyle(event);
  }

  public onEventContainerClick(event: MouseEvent): void {
    const eventsContainer: Element | null = event.target as HTMLElement;

    if (!eventsContainer) return;

    const { hours, minutes } = calculateClickedHourAndMinute(eventsContainer, event.clientY);

    if (hours < 0 || hours > HOURS_IN_A_DAY) return;

    const date = new Date(this.date);

    date.setHours(hours, minutes, 0, 0);
    this.openEventDialog({ date })
      .afterClosed()
      .subscribe((result) => result && this.eventService.addEvent(result).subscribe(() => this.loadEvents()));
  }

  public onEventClickHandler(event: ICalendarEvent): void {
    this.openEventDialog({ event })
      .afterClosed()
      .subscribe((result) => result && this.eventService.updateEvent(result).subscribe(() => this.loadEvents()));
  }

  public onDropHandler(event: CdkDragDrop<ICalendarEvent[]>): void {
    if (!this.dragEvent) return;

    const clientY = event.dropPoint.y - 50;
    const { hours, minutes } = calculateClickedHourAndMinute(event.container.element.nativeElement, clientY);
    const diff = this.dragEvent.end.getHours() - this.dragEvent.start.getHours();
    const start = new Date(this.dragEvent.start.getTime());

    start.setHours(hours);
    start.setMinutes(minutes);

    const end = new Date(start.getTime());

    end.setHours(end.getHours() + diff);
    end.setMinutes(end.getMinutes());

    this.dragEvent.start = start;
    this.dragEvent.end = end;

    this.updateCalenderEvents(this.dragEvent);
  }

  public onDragStartedHandler(dragEvent: ICalendarEvent): void {
    this.dragEvent = dragEvent;
  }

  private updateCalenderEvents(event: ICalendarEvent): void {
    this.eventService.updateEvent(event).subscribe();
  }

  private openEventDialog(data: EventDialogDataType): MatDialogRef<EventDialogComponent, ICalendarEvent> {
    return this.dialog.open(EventDialogComponent, { width: '500px', data });
  }

  private loadEvents(): void {
    this.eventService
      .getEvents()
      .pipe(map((events) => events.filter((event) => event.start.toDateString() === this.date.toDateString())))
      .subscribe((events) => this.eventsSubject.next(events));
  }
}