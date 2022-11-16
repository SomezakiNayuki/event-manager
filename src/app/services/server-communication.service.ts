import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class ServerCommunicationService {

  public getBaseURL(): string {
    return 'http://localhost:8080';
  }

}
