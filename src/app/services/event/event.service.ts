import { Observable, of, catchError, map } from "rxjs";

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { CalendarEvent } from "@interfaces/event.interface";

@Injectable({ providedIn: "root" })
export class EventService {
  private readonly apiUrl = "api/events";

  constructor(private readonly http: HttpClient) {}

  public getEvents(): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(this.apiUrl).pipe(
      map((events) => events.map((event) => ({ ...event, start: new Date(event.start), end: new Date(event.end) }))),
      catchError(this.handleError<CalendarEvent[]>("getEvents", [])),
    );
  }

  public getEvent(id: number): Observable<CalendarEvent> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<CalendarEvent>(url).pipe(catchError(this.handleError<CalendarEvent>(`getEvent id=${id}`)));
  }

  public addEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.http
      .post<CalendarEvent>(this.apiUrl, event)
      .pipe(catchError(this.handleError<CalendarEvent>("addEvent")));
  }

  public updateEvent(event: CalendarEvent): Observable<any> {
    const url = `${this.apiUrl}/${event.id}`;
    return this.http.put(url, event).pipe(catchError(this.handleError<any>("updateEvent")));
  }

  public deleteEvent(id: number): Observable<CalendarEvent> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<CalendarEvent>(url).pipe(catchError(this.handleError<CalendarEvent>("deleteEvent")));
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
