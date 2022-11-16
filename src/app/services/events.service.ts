import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, tap, throwError } from "rxjs";
import { Event } from "../models/event.model";
import { ServerCommunicationService } from "./server-communication.service";

@Injectable({
  providedIn: 'root',
})
export class EventsService {

  private baseURL: string;

  constructor(private http: HttpClient, private serverCommunicationService: ServerCommunicationService) {
    this.baseURL = this.serverCommunicationService.getBaseURL();
  }

  public getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.baseURL + '/events')
      .pipe(
        catchError(this.eventsErrorHandler.bind(this))
      );
  }

  public getRecommendedEvents(customerId: number, username: string): Observable<Event[]> {
    let requestBody = {
      customerId: customerId,
      username: username
    };
    return this.http.post<Event[]>(this.baseURL + '/getRecommendEventsList', requestBody)
      .pipe(
        catchError(this.eventsErrorHandler.bind(this))
      );
  }

  private eventsErrorHandler(err: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }

}
