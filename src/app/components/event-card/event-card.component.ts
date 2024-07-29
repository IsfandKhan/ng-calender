import { map, Observable } from 'rxjs';

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { EventService } from '@services/event/event.service';

import { ClickStopPropagationDirective } from '@directives/click-stop-propagation.directive';

import { IEventStyle } from '@interfaces/common.interface';
import { ICalendarEvent } from '@interfaces/event.interface';

import { calculateClickedHourAndMinute, getEventStyle, HOURS_IN_A_DAY } from '@utils/utils';
import { EventDialogComponent } from '@components/event-dialog/event-dialog.component';

@Component({
  selector: 'cal-event-card',
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss',
  imports: [CommonModule, ClickStopPropagationDirective],
  standalone: true,
})
export class EventCardComponent {
  @Input() public event!: ICalendarEvent;

  @Output() public readonly onClick: EventEmitter<void> = new EventEmitter();

  constructor(
    private readonly eventService: EventService,
    private readonly dialog: MatDialog,
  ) {}

  public getEventStyle(event: ICalendarEvent): IEventStyle {
    return getEventStyle(event);
  }

  public onClickHandler(): void {
    this.openDialog();
  }

  private openDialog() {
    this.dialog
      .open(EventDialogComponent, { data: { event: this.event } })
      .afterClosed()
      .subscribe((result) => result && this.eventService.updateEvent(result).subscribe(() => this.onClick.emit()));
  }
}
