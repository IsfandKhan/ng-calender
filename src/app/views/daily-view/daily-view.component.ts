import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CdkDragDrop, CdkDragStart, DragDropModule } from '@angular/cdk/drag-drop';

import { EventService } from '@services/event/event.service';

import { ClickStopPropagationDirective } from '@directives/click-stop-propagation.directive';

import { ITimeOfDay } from '@interfaces/common.interface';
import { ICalendarEvent } from '@interfaces/event.interface';

interface IEventStyle {
  top: string;
  height: string;
}

@Component({
  selector: 'cal-daily-view',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    DragDropModule,
    MatProgressSpinnerModule,
    ClickStopPropagationDirective,
  ],
  templateUrl: './daily-view.component.html',
  styleUrl: './daily-view.component.scss',
  standalone: true,
})
export class DailyViewComponent implements OnInit, AfterViewInit {
  @Input() public events: ICalendarEvent[] | null = [];

  @Output() public readonly onEventClick: EventEmitter<ICalendarEvent> = new EventEmitter();
  @Output() public readonly onEventsContainerClick: EventEmitter<ITimeOfDay> = new EventEmitter();
  @Output() public readonly onNavigateBack: EventEmitter<void> = new EventEmitter();
  @Output() public readonly onNavigateForward: EventEmitter<void> = new EventEmitter();
  @Output() public readonly onEventDrop: EventEmitter<ICalendarEvent> = new EventEmitter();
  @Output() public readonly onReloadEvents: EventEmitter<void> = new EventEmitter();

  public hours: string[] = [];

  @ViewChild('eventsContainer', { static: false }) private readonly eventsContainer!: ElementRef;
  @ViewChild('hoursLabel', { static: false }) private readonly hoursLabel!: ElementRef;

  private dragEvent: ICalendarEvent | null = null;

  constructor(private readonly eventService: EventService) {}

  public ngOnInit(): void {
    this.generateHours();
  }

  public ngAfterViewInit(): void {
    this.eventsContainer.nativeElement.style.height = `${this.hoursLabel.nativeElement.clientHeight}px`;
  }

  public getEventStyle(event: ICalendarEvent): IEventStyle {
    const startMinutes = event.start.getHours() * 60 + event.start.getMinutes();
    const endMinutes = event.end.getHours() * 60 + event.end.getMinutes();

    return { top: `${startMinutes}px`, height: `${endMinutes - startMinutes}px` };
  }

  public navigateBack(): void {
    this.onNavigateBack.emit();
  }

  public navigateForward(): void {
    this.onNavigateForward.emit();
  }

  public onEventContainerClick(event: MouseEvent): void {
    const eventsContainer: Element | null = (event.target as HTMLElement).closest('.events');

    if (!eventsContainer) return;

    const rect = eventsContainer.getBoundingClientRect();
    const offsetY = event.clientY - rect.top;
    const containerHeight = rect.height;
    const totalHours = 24;
    const hourHeight = containerHeight / totalHours;
    const clickedHour = Math.floor(offsetY / hourHeight);
    const clickedMinute = Math.floor((offsetY % hourHeight) / (hourHeight / 60));
    const shouldEmitValue = clickedHour >= 0 && clickedHour < totalHours;

    shouldEmitValue && this.onEventsContainerClick.emit({ hours: clickedHour, minutes: clickedMinute });
  }

  public onEventClickHandler(event: ICalendarEvent): void {
    this.onEventClick.emit(event);
  }

  public onDropHandler(event: CdkDragDrop<ICalendarEvent[]>): void {
    if (this.dragEvent) {
      const containerRect = event.container.element.nativeElement.getBoundingClientRect();
      const offsetY = event.dropPoint.y - containerRect.top;
      const containerHeight = containerRect.height;
      const totalHours = 24;
      const hourHeight = containerHeight / totalHours;
      const clickedHour = Math.floor(offsetY / hourHeight);
      const clickedMinute = Math.floor((offsetY % hourHeight) / (hourHeight / 60));
      const diff = this.dragEvent.end.getHours() - this.dragEvent.start.getHours();
      const newStart = new Date(this.dragEvent.start.getTime());

      newStart.setHours(clickedHour);
      newStart.setMinutes(clickedMinute);

      const newEnd = new Date(newStart.getTime());

      newEnd.setHours(newEnd.getHours() + diff);
      newEnd.setMinutes(newEnd.getMinutes());

      this.dragEvent.start = newStart;
      this.dragEvent.end = newEnd;
      this.eventService.updateEvent(this.dragEvent).subscribe(() => this.onReloadEvents.emit());
      this.dragEvent = null;
    }
  }

  public onDragStartedHandler(_event: CdkDragStart, dragEvent: ICalendarEvent): void {
    this.dragEvent = dragEvent;
  }

  private generateHours(): void {
    this.hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  }
}
