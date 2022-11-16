import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { ServerCommunicationService } from '../services/server-communication.service';

@Component({
  selector: 'em-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  private baseURL: string;

  @Input() public user: User;

  constructor(private http: HttpClient, private serverCommunicationService: ServerCommunicationService) {
  }

  public ngOnInit(): void {
    this.baseURL = this.serverCommunicationService.getBaseURL();

    setInterval(() => {
      this.fetchMessage();
    }, 1000);
  }

  private fetchMessage(): void {
    if (this.user) {
      this.http.post<any>(this.baseURL + '/fetchMessage', {username: this.user.username}).subscribe(data => {
        this.user.messages = data.reverse();
      });
    }
  }

}
