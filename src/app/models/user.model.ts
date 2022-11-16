import { Message } from "./message.model";
import { Ticket } from "./ticket.model";

export class User {
  public id: number;
  public accountType: string;
  public isLoggedIn?: boolean;
  public username: string;
  public email: string;
  public firstName: string;
  public lastName: string;
  public messages: Message[];
  public tickets: Ticket[];
}
