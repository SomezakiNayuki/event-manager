import { Reply } from "./reply.model";

export class Review {
  public id: number;
  public author: string;
  public text: string;
  public dateTime: string;
  public replies: Reply[];
}
