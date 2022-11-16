import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Event } from '../models/event.model';
import { User } from '../models/user.model';
import { EventsService } from '../services/events.service';
declare var $: any;

@Component({
  selector: 'em-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnChanges, OnDestroy {

  @Input() user: User;
  @Input() search: string;
  @Input() isDetail: boolean;

  protected eventList: Event[] = [];
  protected chosenEvent: Event;

  protected isHostMode: boolean = false;

  private subsription: Subscription;
  protected errorMessage: string;

  constructor(private eventsService: EventsService) { }

  public ngOnInit(): void {
    setInterval(() => {
      this.fetchEvents();
    }, 1000);
  }

  public ngOnChanges(): void {
    if (this.user && this.user.accountType === 'host') {
      this.isHostMode = true;
    } else {
      this.isHostMode = false;
    }

    if (this.search) {
      this.fetchEvents();
      this.searchEvents();
    }
  }

  public ngOnDestroy(): void {
    this.subsription.unsubscribe();
  }

  protected searchEvents(): Event[] {
    if (this.isHostMode) {
      return this.eventList.filter(event => event.name.includes(this.search) && event.host === this.user.username);
    } else {
      return this.eventList.filter(event => event.name.includes(this.search) || event.description.includes(this.search) || event.type.includes(this.search));
    }
  }

  protected openEventDetails(chosenEvent: Event): void {
    this.chosenEvent = chosenEvent;
    $('#EventCardModal').modal('show');
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
      },
      error: err => this.errorMessage = err
    });
  }

  protected receiveFetchEvent($event: any): void {
    this.fetchEvents();
  }

}
