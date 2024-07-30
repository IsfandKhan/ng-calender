import { FormGroup } from '@angular/forms';

import { IEventStyle } from '@interfaces/common.interface';
import { ICalendarEvent } from '@interfaces/event.interface';

import { HOURS_IN_A_DAY, MINUTES_IN_AN_HOUR } from './constants';

export function calculateClickedHourAndMinute(eventsContainer: Element, clientY: number): { hours: number; minutes: number } {
  const rect = eventsContainer.getBoundingClientRect();
  const offsetY = clientY - rect.top;
  const containerHeight = rect.height;
  const hourHeight = containerHeight / HOURS_IN_A_DAY;
  const hours = Math.floor(offsetY / hourHeight);
  const minutes = Math.floor((offsetY % hourHeight) / (hourHeight / MINUTES_IN_AN_HOUR));

  return { hours, minutes };
}

export function getEventStyle(event: ICalendarEvent): IEventStyle {
  const startMinutes = event.start.getHours() * MINUTES_IN_AN_HOUR + event.start.getMinutes();
  const endMinutes = event.end.getHours() * MINUTES_IN_AN_HOUR + event.end.getMinutes();

  return { top: `${startMinutes + 8}px`, height: `${endMinutes - startMinutes}px` };
}

export function parse24HourTimeString(time: string): Date {
  const [hours, minutes] = time.split(':');

  return new Date(0, 0, 0, +hours, +minutes);
}

export function isFormValueRequired(form: FormGroup, controlName: string): boolean {
  return form.get(controlName)?.hasError('required') || false;
}
