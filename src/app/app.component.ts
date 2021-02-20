import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChatService} from './chat/shared/chat.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'chat-app-y2021-frontend';
  onlineClients = 0;
  newMessages = 0;
  unsubscriber$ = new Subject();

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.listenForClients()
      .pipe(
        takeUntil(this.unsubscriber$)
      )
      .subscribe((clients) => {
        this.onlineClients = clients.length;
      });
    this.chatService.listenForWelcome()
      .pipe(
        takeUntil(this.unsubscriber$)
      )
      .subscribe((w) => {
        this.chatService.countNewMessages = false;
        this.newMessages = 0;
      });
    this.chatService.listenToMessages().
      pipe(
        takeUntil(this.unsubscriber$)
      )
      .subscribe((message) => {
        this.countMessages();
      });
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

  countMessages(): void {
    if (this.chatService.countNewMessages) {
      this.newMessages++;
    }
  }

}
