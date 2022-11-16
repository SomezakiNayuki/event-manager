import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { EventCardComponent } from './event-card/event-card.component';
import { AccountComponent } from './account/account.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { BrowseComponent } from './browse/browse.component';
import { TicketsComponent } from './tickets/tickets.component';
import { EventsComponent } from './events/events.component';
import { SearchComponent } from './search/search.component';
import { ModalCloudGraphicComponent } from './modal-cloud-graphic/modal-cloud-graphic.component';
import { MessageComponent } from './message/message.component';
import { EventTypeIconComponent } from './event-type-icon/event-type-icon.component';
import { EventDetailHostComponent } from './event-detail-host/event-detail-host.component';
import { TicketSelectionComponent } from './ticket-selection/ticket-selection.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EventCardComponent,
    AccountComponent,
    EventDetailComponent,
    AuthenticationComponent,
    BrowseComponent,
    TicketsComponent,
    EventsComponent,
    SearchComponent,
    ModalCloudGraphicComponent,
    MessageComponent,
    EventTypeIconComponent,
    EventDetailHostComponent,
    TicketSelectionComponent
    ],

imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatGridListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
