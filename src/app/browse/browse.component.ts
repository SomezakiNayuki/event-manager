import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Event } from '../models/event.model';
import { User } from '../models/user.model';
import { EventsService } from '../services/events.service';
declare var $: any;

@Component({
  selector: 'em-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit, OnDestroy, OnChanges {

  @Input() public user: User;
  @Input() public isDetail: boolean;

  protected eventList: Event[] = [];
  protected upcomingEventList: Event[] = [];
  protected pastEventList: Event[] = [];
  protected recommendedEventList: Event[] = [];
  protected thisMonthEventList: Event[] = [];
  protected chosenEvent: Event;

  private subsription: Subscription;
  private recommendationSubsription: Subscription;
  protected errorMessage: string;

  constructor(private eventsService: EventsService) { }

  public ngOnInit(): void {
    this.recommendedEventList = [];
    this.upcomingEventList = [];
    this.pastEventList = [];
    this.thisMonthEventList = [];
    this.chosenEvent = undefined;

    let refreshRecommendation = true;
    setInterval(() => {
      if (refreshRecommendation) {
        this.fetchRecommendedEvents();
      }
      if (this.user) {
        refreshRecommendation = false;
      }
      this.fetchEvents();
    }, 1000);
  }

  public ngOnChanges(): void {
    if (this.user) {
      this.recommendedEventList = [];

      let refreshRecommendation = true;
      setInterval(() => {
        if (refreshRecommendation) {
          this.fetchRecommendedEvents();
        }
        if (this.user) {
          refreshRecommendation = false;
        }
      }, 1000);
    }
  }

  public ngOnDestroy(): void {
    if (this.subsription && this.recommendationSubsription) {
      this.subsription.unsubscribe();
      this.recommendationSubsription.unsubscribe();
    }
  }

  protected openEventDetails(chosenEvent: Event): void {
    this.chosenEvent = chosenEvent;
    $('#EventCardModal').modal('show');
  }

  protected fetchRecommendedEvents(): void {
    if (this.user) {
      this.recommendationSubsription = this.eventsService.getRecommendedEvents(this.user.id, this.user.username).subscribe({
        next: events => {
          this.recommendedEventList = events;
          if (this.chosenEvent) {
            this.eventList.forEach(event => {
              if (event.id === this.chosenEvent.id) {
                this.chosenEvent = event;
              }
            })
          }
        },
        error: err => this.errorMessage = err
      });
    }
  }

  protected fetchEvents(): void {
    this.subsription = this.eventsService.getEvents().subscribe({
      next: events => {
        this.eventList = events;
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

  protected receiveFetchEvent($event: any): void {
    this.fetchEvents();
  }

  private classifyEventsByDate(): void {
    this.upcomingEventList = [];
    this.pastEventList = [];
    this.thisMonthEventList = [];

    let now = new Date();
    this.eventList.forEach(event => {
      let eventDate = new Date(event.endDateTime);
      if (eventDate < now) {
        this.pastEventList.push(event);
      } else {
        this.upcomingEventList.push(event);
      }
    });

    now.setMonth(now.getMonth() + 1);
    this.eventList.forEach(event => {
      let eventDate = new Date(event.endDateTime);
      if (eventDate < now) {
        this.thisMonthEventList.push(event);
      }
    });

  }

}
