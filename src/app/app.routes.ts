import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./features/calendar/calendar.component").then((c) => c.CalendarComponent),
    pathMatch: "full",
  },
  {
    path: "events",
    loadComponent: () => import("./features/event-list/event-list.component").then((c) => c.EventListComponent),
    pathMatch: "full",
  },
  { path: "**", redirectTo: "" },
];
