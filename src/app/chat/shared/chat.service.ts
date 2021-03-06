import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {ChatClient} from './chat-client.model';
import {ChatMessage} from './chat-message.model';
import {WelcomeDto} from './welcome.dto';
import {map} from 'rxjs/operators';
import {ChatSocket} from '../../app.module';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  chatClient: ChatClient;
  countNewMessages = false;

  constructor(private socket: ChatSocket) { }

  sendMessage(msg: string): void{
    this.socket.emit('message', msg);
  }

  sendTyping(typing: boolean): void {
    this.socket.emit('typing', typing);
  }

  listenToMessages(): Observable<ChatMessage> {
    return this.socket
      .fromEvent<ChatMessage>('newMessage');
  }

  listenForClientTyping(): Observable<ChatClient> {
    return this.socket
      .fromEvent<ChatClient>('clientTyping');
  }

  listenForClients(): Observable<ChatClient[]> {
    return this.socket
      .fromEvent<ChatClient[]>('clients');
  }

  listenForWelcome(): Observable<WelcomeDto> {
    return this.socket
      .fromEvent<WelcomeDto>('welcome');
  }

  listenForErrors(): Observable<string> {
    return this.socket
      .fromEvent<string>('error');
  }

  listenForConnect(): Observable<string> {
    return this.socket
      .fromEvent<string>('connect')
      .pipe(
        map(() => {
          return this.socket.ioSocket.id;
        })
      );
  }

  listenForDisconnect(): Observable<string> {
    return this.socket
      .fromEvent<string>('disconnect')
      .pipe(
        map(() => {
          return this.socket.ioSocket.id;
        })
      );
  }

  sendName(name: string): void {
    this.socket.emit('name', name);
  }

  getAllMessages(): Observable<ChatMessage[]> {
    return this.socket
      .fromEvent<ChatMessage[]>('AllMessages');
  }

  connect(): void {
    this.socket.connect();
  }

  disconnect(): void {
    this.socket.disconnect();
  }


}
