import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Event } from '../models/event.model';
import { Review } from '../models/review.model';
import { Ticket } from '../models/ticket.model';
import { User } from '../models/user.model';
import { ServerCommunicationService } from '../services/server-communication.service';
declare var $: any;

@Component({
  selector: 'em-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {

  private baseURL: string;
  public purchasingTickets: boolean;

  @Input() public event: Event;
  @Input() public hostMode: boolean;
  @Input() public user: User;
  @Input() public isDetail: boolean;

  @Output() private fetchEvent = new EventEmitter<boolean>();

  protected reviewContent: string;
  protected replyContent: string;

  constructor(private http: HttpClient, private serverCommunicationService: ServerCommunicationService) { }

  public ngOnInit(): void {
    this.purchasingTickets = false;
    this.reviewContent = undefined;
    this.replyContent = undefined;

    this.baseURL = this.serverCommunicationService.getBaseURL();
  }

  protected closeEventDetails(): void {
    $('#EventCardModal').modal('hide');
  }

  protected submitComment(): void {
    let requestBody = undefined;
    let now = new Date().toISOString();
    if (this.user && this.reviewContent != undefined && this.reviewContent != '') {
      requestBody = {
        username: this.user.username,
        eventId: this.event.id,
        title: '',
        text: this.reviewContent,
        datetime: now.split('T')[0] + ' ' + now.split('T')[1].slice(0, -8)
       };
       this.http.post<any>(this.baseURL + '/createReview', requestBody).subscribe(() => {
        this.fetchEvent.emit(true);
        this.reviewContent = undefined;
       });
    } else if (this.reviewContent != undefined && this.reviewContent != '') {
      requestBody = {
        username: 'Anonymous',
        eventId: this.event.id,
        title: '',
        text: this.reviewContent,
        datetime: now.split('T')[0] + ' ' + now.split('T')[1].slice(0, -8)
       };
       this.http.post<any>(this.baseURL + '/createReview', requestBody).subscribe(() => {
        this.fetchEvent.emit(true);
        this.reviewContent = undefined;
       });
    }
    this.fetchEvent.emit(true);
    this.reviewContent = undefined;
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

  protected openSeatingMap(): void {
    this.purchasingTickets = true;
  }

  protected closeSeatingMap(): void {
    this.purchasingTickets = false;
  }

  protected isPastEvent(): boolean {
    if (this.event) {
      let date = new Date(this.event.endDateTime);
      let now = new Date();
      if (date < now) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  protected recieveCloseSeatingMapEvent(): void {
    this.closeEventDetails();
    this.closeSeatingMap();
  }

}
