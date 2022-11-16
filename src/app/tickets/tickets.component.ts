import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Event } from '../models/event.model';
import { Ticket } from '../models/ticket.model';
import { User } from '../models/user.model';
import { ServerCommunicationService } from '../services/server-communication.service';
declare var $: any;

@Component({
  selector: 'em-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  private baseURL: string;

  @Input() public user: User;

  protected bookedEvents: Event[];
  protected bookedTicketsInformation: any[];

  protected chosenTicket: Ticket;

  protected isCancelTicketFailed: boolean;
  protected isCreditCardFieldsValid: boolean;

  protected cardNumber: string;
  protected name: string;
  protected cvv: string;
  protected expiryDate: string;

  constructor(private http: HttpClient, private serverCommunicationService: ServerCommunicationService) { }

  public ngOnInit(): void {
    this.baseURL = this.serverCommunicationService.getBaseURL();
    this.bookedTicketsInformation = [];
    this.bookedEvents = [];
    this.isCancelTicketFailed = false;
    this.chosenTicket = undefined;
    this.isCreditCardFieldsValid = true;

    this.cardNumber = undefined;
    this.name = undefined;
    this.cvv = undefined;
    this.expiryDate = undefined;

    setInterval(() => {
      this.fetchTickets();
      this.fetchEvents();
      this.handleBookedTicketsAndEvents();
    }, 1000);
  }

  private fetchTickets(): void {
    if (this.user) {
      this.http.post<any>(this.baseURL + '/getTicketsByUsername', {username: this.user.username}).subscribe(data => {
        this.user.tickets = data;
      });
    }
  }

  private fetchEvents(): void {
    if (this.user) {
      this.http.post<any>(this.baseURL + '/getEventsByUsername', {username: this.user.username}).subscribe(data => {
        this.bookedEvents = data;
      });
    }
  }

  private handleBookedTicketsAndEvents(): void {
    this.bookedTicketsInformation = [];
    if (this.bookedEvents) {
      for (let ticket of this.user.tickets) {
        for (let event of this.bookedEvents) {
          if (this.isTicketOfEvent(ticket, event)) {
            this.bookedTicketsInformation.push({
              event: event,
              ticket: ticket
            })
            break;
          }
        }
      }
    }
  }

  private isTicketOfEvent(ticket: Ticket, event: Event): boolean {
    let result = false;

    for (let rawTicket of event.tickets) {
      if (rawTicket.id === ticket.id) {
        result = true;
        break;
      }
    }

    return result;
  }

  protected cancelTicket(ticket: Ticket): void {
    this.http.post<any>(this.baseURL + '/cancelTicket', {ticketId: ticket.id}).pipe(
      catchError(this.cancelTicketErrorHandler.bind(this))
    ).subscribe();
  }

  private cancelTicketErrorHandler(err: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    this.isCancelTicketFailed = true;
    console.error(errorMessage);
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    return throwError(() => errorMessage);
  }

  protected readErrorMessage(): void {
    this.isCancelTicketFailed = false;
  }

  protected isPastEvent(event: Event): boolean {
    let date = new Date(event.endDateTime);
    let now = new Date();
    if (date < now) {
      return true;
    } else {
      return false;
    }
  }

  protected openPaymentModal(): void {
    this.cardNumber = undefined;
    this.name = undefined;
    this.cvv = undefined;
    this.expiryDate = undefined;
    $('#PaymentModal').modal('show');
  }

  protected closePaymentModal(): void {
    $('#PaymentModal').modal('hide');
  }

  protected pay(): void {
    if (this.validateCreditCardFields()) {
      let requestBody = {
        username: this.user.username,
        name: this.name,
        cvv: this.cvv,
        cardNumber: this.cardNumber,
        expiryDate: this.expiryDate
      };
      this.http.post<any>(this.baseURL + '/addPaymentDetails', requestBody).subscribe(() => {
        this.bookTicket(this.chosenTicket);
        this.closePaymentModal();
      });
    }
  }

  protected bookTicket(ticket: Ticket): void {
    if (this.user) {
      this.http.post<any>(this.baseURL + '/bookTicket', {ticketId: ticket.id, username: this.user.username}).subscribe(() => {
        this.chosenTicket = undefined;
      });
    }
  }

  protected payTicket(ticket: Ticket): void {
    this.chosenTicket = ticket;
    this.openPaymentModal();
  }

  private validateCreditCardFields(): boolean {
    let now = new Date();
    let date = new Date(this.expiryDate);
    if (/^\d+$/.test(this.cardNumber) && this.cardNumber.length === 16 && /^[a-zA-Z]+$/.test(this.name) && /^\d+$/.test(this.cvv) && this.cvv.length === 3 && this.expiryDate && (date > now)) {
      this.isCreditCardFieldsValid = true;
      return true;
    } else {
      this.isCreditCardFieldsValid = false;
      return false;
    }
  }

  protected getExpiryRemainingTime(ticket: Ticket): string {
    let now = new Date();
    let date = new Date(ticket.reservedUntilDateTime);
    let result = date.getTime() - now.getTime();
    return this.SplitTime(result/1000/60/60);
  }

  private SplitTime(numberOfHours: number){
    var Days = Math.floor(numberOfHours/24);
    var Remainder = numberOfHours % 24;
    var Hours = Math.floor(Remainder);
    var Minutes = Math.floor(60*(Remainder-Hours));
    return `Days: ${Days}, Hours: ${Hours}, Minutes: ${Minutes}`;
}

}
