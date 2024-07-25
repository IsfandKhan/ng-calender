import { Routes } from '@angular/router';

import { CalendarComponent } from './views/calendar/calendar.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./views/calendar/calendar.component').then((c) => c.CalendarComponent),
    pathMatch: 'full',
  },
  {
    path: 'events',
    loadComponent: () => import('./views/event-list/event-list.component').then((c) => c.EventListComponent),
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];
