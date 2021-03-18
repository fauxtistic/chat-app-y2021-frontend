import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ChatService} from './shared/chat.service';
import {Observable, Subject, Subscription} from 'rxjs';
import {debounceTime, take, takeUntil} from 'rxjs/operators';
import {ChatClient} from './shared/chat-client.model';
import {ChatMessage} from './shared/chat-message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  messageFormControl = new FormControl('');
  nameFormControl = new FormControl('');
  messages: ChatMessage[] = [];
  clientsTyping: ChatClient[] = [];
  clients$: Observable<ChatClient[]>;
  error$: Observable<string>;
  unsubscriber$ = new Subject();
  chatClient: ChatClient;
  socketId: string | undefined;

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.chatService.countNewMessages = false; // maybe unnecessary when it's called in appcomponent listenforwelcome
    this.clients$ = this.chatService.listenForClients();
    this.error$ = this.chatService.listenForErrors();
    this.messageFormControl.valueChanges
      .pipe(
        takeUntil(this.unsubscriber$),
        debounceTime(500)
      )
      .subscribe((value) => {
        this.chatService.sendTyping(value.length > 0);
      });
    this.chatService.listenToMessages()
      .pipe(
        takeUntil(this.unsubscriber$)
      )
      .subscribe(message => {
        this.messages.push(message);
      });
    this.chatService.listenForClientTyping()
      .pipe(
        takeUntil(this.unsubscriber$)
      )
      .subscribe((chatClient) => {
        // some of this might be overkill according to Lars as backend should already handle some of it?
        if (chatClient.typing && !this.clientsTyping.find((c) => c.id === chatClient.id)) {
          this.clientsTyping.push(chatClient);
        } else {
          this.clientsTyping = this.clientsTyping.filter((c) => c.id !== chatClient.id );
        }
      });
    this.chatService.listenForWelcome()
      .pipe(
        takeUntil(this.unsubscriber$)
      )
      .subscribe(welcome => {
        this.messages = welcome.messages;
        this.chatClient = this.chatService.chatClient = welcome.client;
        for (const client of welcome.clients) {
          if (client.typing) {
            this.clientsTyping.push(client);
          }
        }
      });
    // if already entered name earlier
    if (this.chatService.chatClient) {
      this.chatService.sendName(this.chatService.chatClient.name);
    }
    this.chatService.listenForConnect()
      .pipe(
        takeUntil(this.unsubscriber$)
      )
      .subscribe((id) => {
        console.log('connect id', id);
        this.socketId = id;
      });
    this.chatService.listenForDisconnect()
      .pipe(
        takeUntil(this.unsubscriber$)
      )
      .subscribe((id) => {
        console.log('disconnect id', id);
        this.socketId = id;
      });
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
    this.chatService.countNewMessages = true;
    this.chatService.sendTyping(false);
  }

  sendMessage(): void {
    this.chatService.sendMessage(this.messageFormControl.value);
    this.messageFormControl.patchValue('');
  }

  sendName(): void {
    // remember validate name in service
    if (this.nameFormControl.value) {
      this.chatService.sendName(this.nameFormControl.value);
    }
  }
}
