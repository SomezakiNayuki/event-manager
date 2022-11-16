export class Ticket {
  public id: number;
  public status: string;
  public seatRow: string;
  public seatNumber: number;
  public price: number;
  public reservedUntilDateTime?: string;
}
