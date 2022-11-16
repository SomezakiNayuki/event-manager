import { Review } from "./review.model";
import { Ticket } from "./ticket.model";

export class Event {
  public id: number;
  public name: string;
  public type: string;
  public description: string;
  public host: string;
  public startDateTime: string;
  public endDateTime: string;
  public artist: string;
  public venue: string;
  public address: string;
  public ticketPrice: string;
  public picture: string; /* to be removed */
  public reviews: Review[];
  public tickets: Ticket[];
  public availableTickets: string;
}