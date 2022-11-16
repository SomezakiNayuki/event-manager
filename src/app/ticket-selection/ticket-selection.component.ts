import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Event } from '../models/event.model';
import { Ticket } from '../models/ticket.model';
import { User } from '../models/user.model';
import { ServerCommunicationService } from '../services/server-communication.service';
declare var $: any;

@Component({
  selector: 'em-ticket-selection',
  templateUrl: './ticket-selection.component.html',
  styleUrls: ['./ticket-selection.component.css']
})
export class TicketSelectionComponent implements OnInit {

  private baseURL: string;

  protected chosenTicket: Ticket;
  protected reservedTickets: Number[] = [];
  protected friendUsername: string;

  protected bookTicketScreen: boolean;
  protected reserveTicketScreen: boolean;
  protected confirmationScreen: boolean;
  protected isReserveFailed: boolean;
  protected isCreditCardFieldsValid: boolean;
  protected isPaymentModalForPurchaseScreen: boolean;

  protected cardNumber: string;
  protected name: string;
  protected cvv: string;
  protected expiryDate: string;

  @Input() public event: Event;
  @Input() public user: User;

  @Output() private closeSeatingMapEvent = new EventEmitter<any>();

  constructor(private http: HttpClient, private serverCommunicationService: ServerCommunicationService) { }

  ngOnInit(): void {
    this.baseURL = this.serverCommunicationService.getBaseURL();
    this.chosenTicket = undefined;
    this.friendUsername = undefined;
    this.bookTicketScreen = true;
    this.reserveTicketScreen = false;
    this.confirmationScreen = false;
    this.isReserveFailed = false;
    this.isCreditCardFieldsValid = true;
    this.isPaymentModalForPurchaseScreen = false;

    this.cardNumber = undefined;
    this.name = undefined;
    this.cvv = undefined;
    this.expiryDate = undefined;
  }

  protected bookTicket() {
    let ticket = this.chosenTicket;
    if (this.user) {
      this.http.post<any>(this.baseURL + '/bookTicket', {ticketId: ticket.id, username: this.user.username}).subscribe();
    }
  }

  protected reserveTicket(ticketId: Number, username: string) {
    let now = new Date().toISOString();
    if (this.user) {
      this.http.post<any>(this.baseURL + '/reserveTicket', {ticketId: ticketId, username: username, reservationMinutes: 15}).pipe(
        catchError(this.reserveTicketErrorHandler.bind(this))
      ).subscribe(() => {
        this.http.post<any>(this.baseURL + '/sendMessage', {username: username, message: '[' + now.split('T')[0] + ' ' + now.split('T')[1].slice(0, -8) + ']' + ' ' + `${this.user.username} has reserved a ticket for you. The reservation expires in 15 minutes.`}).subscribe();
      });
    }
  }

  private reserveTicketErrorHandler(err: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    this.isReserveFailed = true;
    this.reservedTickets = [];
    return throwError(() => errorMessage);
  }

  protected chooseTicket(ticket: Ticket) {
    this.chosenTicket = ticket;
  }

  protected chooseReserveTicket(ticket: Ticket) {
    this.reservedTickets.push(ticket.id);
  }

  protected submitBookChoice(): void {
    this.friendUsername = undefined;
    this.bookTicketScreen = false;
    this.reserveTicketScreen = true;
  }

  protected submitReserveChoice(): void {
    this.reserveTicketScreen = false;
    this.confirmationScreen = true;
  }

  protected submitTicketRequests() : void {
    this.bookTicket();

    for (let ticketId of this.reservedTickets) {
      this.reserveTicket(ticketId, this.friendUsername);
    }

    this.confirmationScreen = false;
  }

  protected readErrorMessage(): void {
    this.isReserveFailed = false;
  }

  protected openPaymentModal(): void {
    this.isPaymentModalForPurchaseScreen = true;
  }

  protected closePaymentModal(): void {
    this.isPaymentModalForPurchaseScreen = false;
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
        this.submitTicketRequests();
        this.closePaymentModal();
      });
    }
  }

  private validateCreditCardFields(): boolean {
    let now = new Date();
    let date = new Date(this.expiryDate);
    if (/^\d+$/.test(this.cardNumber) && this.cardNumber.length === 16 && /^[a-zA-Z]+$/.test(this.name) && /^\d+$/.test(this.cvv) && this.cvv.length === 3 && this.expiryDate  && (date > now)) {
      this.isCreditCardFieldsValid = true;
      return true;
    } else {
      this.isCreditCardFieldsValid = false;
      return false;
    }
  }

}
