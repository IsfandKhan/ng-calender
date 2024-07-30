import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { EventService } from '@services/event/event.service';

import { EventDialogComponent } from '@components/event-dialog/event-dialog.component';

import { ClickStopPropagationDirective } from '@directives/click-stop-propagation.directive';

import { EventStyle } from '@interfaces/common.interface';
import { CalendarEvent } from '@interfaces/event.interface';

import { getEventStyle } from '@utils/helpers';

@Component({
  selector: 'cal-event-card',
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss',
  imports: [CommonModule, ClickStopPropagationDirective],
  standalone: true,
})
export class EventCardComponent {
  @Input() public event!: CalendarEvent;

  @Output() public readonly onClick: EventEmitter<void> = new EventEmitter();

  constructor(
    private readonly eventService: EventService,
    private readonly dialog: MatDialog,
  ) {}

  public getEventStyle(event: CalendarEvent): EventStyle {
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
