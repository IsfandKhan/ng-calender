import { Directive, HostBinding, Input, OnInit } from '@angular/core';

import { CalendarEvent } from '@interfaces/event.interface';

@Directive({ selector: '[eventContainer]', standalone: true })
export class EventContainerStyleDirective implements OnInit {
  @Input() public eventContainer: CalendarEvent | null = null;

  @HostBinding('style.top.px') top!: number;
  @HostBinding('style.height.px') height!: number;

  public ngOnInit(): void {
    this.styleEventContainer();
  }

  private styleEventContainer(): void {
    if (!this.eventContainer) return;

    const startMinutes = this.eventContainer.start.getHours() * 60 + this.eventContainer.start.getMinutes();
    const endMinutes = this.eventContainer.end.getHours() * 60 + this.eventContainer.end.getMinutes();

    this.top = startMinutes;
    this.height = endMinutes - startMinutes;
  }
}
