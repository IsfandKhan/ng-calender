import { Observable, of, catchError, map } from 'rxjs';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ICalendarEvent } from '@interfaces/event.interface';

@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly apiUrl = 'api/events';

  constructor(private readonly http: HttpClient) {}

  public getEvents(): Observable<ICalendarEvent[]> {
    return this.http.get<ICalendarEvent[]>(this.apiUrl).pipe(
      map((events) => events.map((event) => ({ ...event, start: new Date(event.start), end: new Date(event.end) }))),
      catchError(this.handleError<ICalendarEvent[]>('getEvents', [])),
    );
  }

  public getEvent(id: number): Observable<ICalendarEvent> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ICalendarEvent>(url).pipe(catchError(this.handleError<ICalendarEvent>(`getEvent id=${id}`)));
  }

  public addEvent(event: ICalendarEvent): Observable<ICalendarEvent> {
    return this.http.post<ICalendarEvent>(this.apiUrl, event).pipe(catchError(this.handleError<ICalendarEvent>('addEvent')));
  }

  public updateEvent(event: ICalendarEvent): Observable<any> {
    const url = `${this.apiUrl}/${event.id}`;
    return this.http.put(url, event).pipe(catchError(this.handleError<any>('updateEvent')));
  }

  public deleteEvent(id: number): Observable<ICalendarEvent> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<ICalendarEvent>(url).pipe(catchError(this.handleError<ICalendarEvent>('deleteEvent')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
