import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { CalendarEvent } from '../../interfaces/event.interface';

@Injectable({ providedIn: 'root' })
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const events: CalendarEvent[] = [
      {
        id: 1,
        title: 'Meeting',
        description: 'Team meeting',
        start: new Date(),
        end: new Date(new Date().setHours(new Date().getHours() + 2)),
      },
      {
        id: 2,
        title: 'Presentation',
        description: 'Client presentation',
        start: new Date(new Date().setHours(new Date().getHours() + 4)),
        end: new Date(new Date().setHours(new Date().getHours() + 8)),
      },
    ];

    return { events };
  }
}
