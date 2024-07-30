import { Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatLineModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';

import { EventService } from '@services/event/event.service';

import { EventDialogComponent } from '@components/event-dialog/event-dialog.component';

import { CalendarEvent } from '@interfaces/event.interface';

@Component({
  selector: 'cal-event-list',
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
  imports: [CommonModule, MatListModule, MatCardModule, MatLineModule, MatToolbarModule],
  standalone: true,
})
export class EventListComponent implements OnInit {
  public events$!: Observable<CalendarEvent[]>;

  constructor(
    private readonly eventService: EventService,
    private readonly dialog: MatDialog,
  ) {}

  public ngOnInit(): void {
    this.loadEvents();
  }

  public loadEvents(): void {
    this.events$ = this.eventService.getEvents();
  }

  public viewEvent(event: CalendarEvent): void {
    this.dialog
      .open(EventDialogComponent, { width: '500px', data: { event } })
      .afterClosed()
      .subscribe((result) => result && this.eventService.updateEvent(result).subscribe(() => this.loadEvents()));
  }
}
