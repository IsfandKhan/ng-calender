import { AfterContentChecked, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { EventsContainerComponent } from '@components/events-container/events-container.component';
import { HoursLabelComponent } from '@components/hours-label/hours-label.component';

@Component({
  selector: 'cal-daily-view',
  templateUrl: './daily-view.component.html',
  styleUrl: './daily-view.component.scss',
  imports: [CommonModule, MatToolbarModule, MatIconModule, EventsContainerComponent, HoursLabelComponent],
  standalone: true,
})
export class DailyViewComponent implements AfterContentChecked {
  @Input() public date = new Date();

  @Output() public readonly onNavigateBack: EventEmitter<void> = new EventEmitter();
  @Output() public readonly onNavigateForward: EventEmitter<void> = new EventEmitter();

  public eventsContainerHeight: number = 0;

  @ViewChild('hoursLabel', { static: true, read: ElementRef }) private readonly hoursLabelRef!: ElementRef<Element>;

  public ngAfterContentChecked(): void {
    this.eventsContainerHeight = this.hoursLabelRef.nativeElement.querySelector('.hour-labels')?.clientHeight || 0;
  }

  public navigateBack(): void {
    this.onNavigateBack.emit();
  }

  public navigateForward(): void {
    this.onNavigateForward.emit();
  }
}
