import { Time } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { Subscription } from 'rxjs';
import { Event } from '../models/event.model';
import { Review } from '../models/review.model';
import { User } from '../models/user.model';
import { EventsService } from '../services/events.service';
import { ServerCommunicationService } from '../services/server-communication.service';
declare var $: any;

@Component({
  selector: 'em-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css', './events-css.component.css']
})
export class EventsComponent implements OnInit, OnDestroy {

  private baseURL: string;

  @Input() public user: User;
  @Input() public isDetail: boolean;

  protected eventList: Event[] = [];
  protected upcomingEventList: Event[] = [];
  protected pastEventList: Event[] = [];
  protected chosenEvent: Event;
  protected broadcastMessage: string;
  protected replyContent: string;

  private subsription: Subscription;
  protected errorMessage: string;

  /* EVENT CREATION */

  protected eventName: string;
  protected eventType: string;
  protected eventStartDateTime: string;
  protected eventEndDateTime: string;
  protected eventVenue: string;
  protected eventAddress: string;
  protected eventArtist: string;
  protected eventHost: string;
  protected eventDescription: string;
  protected eventPicture: string;
  protected eventTicketPrice: string;

  protected invalidEventName: boolean;
  protected invalidEventVenue: boolean;
  protected invalidEventAddress: boolean;
  protected invalidEventArtist: boolean;
  protected invalidStartDateTime: boolean;
  protected invalidEndDateTime: boolean;
  protected invalidEventArt: boolean;
  protected invalidEventTicketPrice: boolean;

  protected isListActive: boolean;
  protected isCreateEventActive: boolean;
  protected isSelectEventTypeScreenActive: boolean;
  protected isEnterEventDetailsScreenActive: boolean;
  protected isEventDetailsActive: boolean;
  protected isConfirmEventActive: boolean;
  protected isDisplayReplies: boolean;

  constructor(private http: HttpClient, private eventsService: EventsService, private serverCommunicationService: ServerCommunicationService) { }

  public ngOnInit(): void {
    this.eventName = undefined;
    this.eventType = undefined;
    this.eventStartDateTime = undefined;
    this.eventEndDateTime = undefined;
    this.eventVenue = undefined;
    this.eventAddress = undefined;
    this.eventArtist = undefined;
    this.eventHost = undefined;
    this.eventDescription = undefined;
    this.eventTicketPrice = undefined;
    this.eventPicture = undefined;
    this.broadcastMessage = undefined;
    this.replyContent = undefined;

    this.invalidStartDateTime = false;
    this.invalidEndDateTime = false;
    this.invalidEventArt = false;
    this.invalidEventArtist = false;
    this.invalidEventName = false;
    this.invalidEventVenue = false;
    this.invalidEventAddress = false;
    this.invalidEventTicketPrice = false;

    this.isListActive = true;
    this.isCreateEventActive = false;
    this.isSelectEventTypeScreenActive = true;
    this.isEnterEventDetailsScreenActive = false;
    this.isConfirmEventActive = false;
    this.isEventDetailsActive = false;
    this.isDisplayReplies = false;

    this.baseURL = this.serverCommunicationService.getBaseURL();

    setInterval(() => {
      this.fetchEvents();
    }, 1000);
  }

  public ngOnDestroy(): void {
    if (this.subsription) {
      this.subsription.unsubscribe();
    }
  }

  protected openEventCreationDialog() {
    this.eventName = undefined;
    this.eventType = undefined;
    this.eventStartDateTime = undefined;
    this.eventEndDateTime = undefined;
    this.eventVenue = undefined;
    this.eventAddress = undefined;
    this.eventArtist = undefined;
    this.eventHost = undefined;
    this.eventDescription = undefined;
    this.eventPicture = undefined;
    this.eventTicketPrice = undefined;

    this.invalidStartDateTime = false;
    this.invalidEndDateTime = false;
    this.invalidEventArt = false;
    this.invalidEventArtist = false;
    this.invalidEventName = false;
    this.invalidEventVenue = false;
    this.invalidEventAddress = false;
    this.invalidEventTicketPrice = false;

    this.isListActive = false;
    this.isCreateEventActive = true;
    this.isSelectEventTypeScreenActive = true;
    this.isEnterEventDetailsScreenActive = false;
    this.isEventDetailsActive = false;
  }

  protected closeEventCreationDialog() {
    this.isListActive = true;
    this.isCreateEventActive = false;
    this.isSelectEventTypeScreenActive = true;
    this.isEnterEventDetailsScreenActive = false;
    this.isEventDetailsActive = false;
    this.isConfirmEventActive = false;
  }

  protected selectEventType(value) {
    this.eventType = value;
    this.isSelectEventTypeScreenActive = false;
    this.isEnterEventDetailsScreenActive = true;
  }

  protected submitEventDetails() {
    if (this.validateEventName(this.eventName) &&
        this.validateEventTicketPrice(this.eventTicketPrice) &&
        this.validateEventVenue(this.eventVenue) &&
        this.validateEventAddress(this.eventAddress) &&
        this.validateEventArtist(this.eventArtist) &&
        this.validateStartDateTime(this.eventStartDateTime) &&
        this.validateEndDateTime(this.eventStartDateTime, this.eventEndDateTime)) {
      if (this.eventDescription == undefined) {
        this.eventDescription = "";
      }
      this.isCreateEventActive = false;
      this.isConfirmEventActive = true;
    }
  }

  private validateEventName(input: String): boolean {
    if (input !== undefined && input !== '') {
      this.invalidEventName = false;
      return true;
    } else {
      this.invalidEventName = true;
      return false;
    }
  }

  private validateEventVenue(input: String): boolean {
    if (input !== undefined && input !== '') {
      this.invalidEventVenue = false;
      return true;
    } else {
      this.invalidEventVenue = true;
      return false;
    }
  }

  private validateEventAddress(input: String): boolean {
    if (input !== undefined && input !== '') {
      this.invalidEventAddress = false;
      return true;
    } else {
      this.invalidEventAddress = true;
      return false;
    }
  }

  private validateEventArtist(input: String): boolean {
    if (input !== undefined && input !== '') {
      this.invalidEventArtist = false;
      return true;
    } else {
      this.invalidEventArtist = true;
      return false;
    }
  }

  private validateStartDateTime(input: string): boolean {
    let now = new Date();
    let eventDate = new Date(input);
    if (input !== undefined && eventDate > now) {
      this.invalidStartDateTime = false;
      return true;
    } else {
      this.invalidStartDateTime = true;
      return false;
    }
  }

  private validateEndDateTime(start: string, end: string): boolean {
    let startDate = new Date(start);
    let endDate = new Date(end);
    if (endDate !== undefined && endDate > startDate) {
      this.invalidEndDateTime = false;
      return true;
    } else {
      this.invalidEndDateTime = true;
      return false;
    }
  }

  private validateEventTicketPrice(input: String): boolean {
    let price = new Number(input);
    if (input !== undefined && input !== '' && price > 0) {
      this.invalidEventTicketPrice = false;
      return true;
    } else {
      this.invalidEventTicketPrice = true;
      return false;
    }
  }

  protected createEvent() {
    let requestBody = {name: this.eventName,
        type: this.eventType,
        description: this.eventDescription,
        host: this.user.username,
        startdatetime: this.eventStartDateTime.split('T')[0] + ' ' + this.eventStartDateTime.split('T')[1],
        enddatetime: this.eventEndDateTime.split('T')[0] + ' ' + this.eventEndDateTime.split('T')[1],
        artist: this.eventArtist,
        venue: this.eventVenue,
        address: this.eventAddress,
        ticketprice: this.eventTicketPrice,
        picture: (this.eventPicture != undefined && this.eventPicture != '') ? this.eventPicture : 'https://img.lemde.fr/2022/06/09/0/411/5083/3389/1440/960/60/0/6870439_1654768589970-hole-in-your-soul-abba-voyage-photo-by-johan-persson-1.jpg'
      }
    this.http.post<any>(this.baseURL + '/createEvent', requestBody).subscribe();
    this.closeEventCreationDialog();
  }

  protected cancelEvent() {
    let now = new Date().toISOString();
    this.http.post<any>(this.baseURL + '/getCustomersByEventId', {eventId: this.chosenEvent.id}).subscribe(data => {
      let customerList = data;
      for (let customer of customerList) {
        this.http.post<any>(this.baseURL + '/sendMessage', {username: customer.username, message: '[' + now.split('T')[0] + ' ' + now.split('T')[1].slice(0, -8) + ']' + ' ' + `Sorry, ${this.chosenEvent.name} has been cancelled. Refunds will be processed over the next few days.`}).subscribe();
      }
      this.http.post<any>(this.baseURL + '/cancelEvent', {eventId: this.chosenEvent.id}).subscribe();
      this.closeEventDetails();
    });
  }

  protected fetchEvents(): void {
    this.subsription = this.eventsService.getEvents().subscribe({
      next: events => {
        this.eventList = events.filter(event => event.host === this.user.username);
        if (this.chosenEvent) {
          this.eventList.forEach(event => {
            if (event.id === this.chosenEvent.id) {
              this.chosenEvent = event;
            }
          })
        }
        this.classifyEventsByDate();
      },
      error: err => this.errorMessage = err
    });
  }

  private classifyEventsByDate(): void {
    this.upcomingEventList = [];
    this.pastEventList = [];

    let now = new Date();
    this.eventList.forEach(event => {
      let eventDate = new Date(event.endDateTime);
      if (eventDate < now) {
        this.pastEventList.push(event);
      } else {
        this.upcomingEventList.push(event);
      }
    });
  }

  protected openEventDetails(event: Event): void {
    this.chosenEvent = event;
    this.replyContent = undefined;

    this.isListActive = false;
    this.isCreateEventActive = false;
    this.isEventDetailsActive = true;
  }

  protected closeEventDetails(): void {
    this.chosenEvent = undefined;
    this.replyContent = undefined;

    this.isListActive = true;
    this.isCreateEventActive = false;
    this.isEventDetailsActive = false;
  }

  protected openBroadcastMessage(): void {
    this.broadcastMessage = undefined;
    $('#BroadcastMessageModal').modal('show');
  }

  protected closeBroadcastMessage(): void {
    $('#BroadcastMessageModal').modal('hide');
  }

  protected openSeatingMap(): void {
    $('#SeatingMapModal').modal('show');
  }

  protected closeSeatingMap(): void {
    $('#SeatingMapModal').modal('hide');
  }

  protected submitBroadcastMessage(): void {
    let now = new Date().toISOString();
    this.http.post<any>(this.baseURL + '/getCustomersByEventId', {eventId: this.chosenEvent.id}).subscribe(data => {
      let customerList = data;
      for (let customer of customerList) {
        this.http.post<any>(this.baseURL + '/sendMessage', {username: customer.username, message: '[' + now.split('T')[0] + ' ' + now.split('T')[1].slice(0, -8) + ']' + ' ' + this.broadcastMessage}).subscribe(() => {
          this.closeBroadcastMessage();
        });
      }
    });
  }

  protected submitReply(review: Review): void {
    if (this.replyContent != undefined && this.replyContent != '') {
      let now = new Date().toISOString();
      let requestBody = {
        username: this.user.username,
        reviewId: review.id,
        text: this.replyContent,
        dateTime: now.split('T')[0] + ' ' + now.split('T')[1].slice(0, -8)
      };
      this.http.post<any>(this.baseURL + '/createReply', requestBody).subscribe(() => {
        this.replyContent = undefined;
      });
    }
  }

  protected displayReplies(): void {
    this.isDisplayReplies = true;
  }

  protected closeReplies(): void {
    this.isDisplayReplies = false;
  }

}
