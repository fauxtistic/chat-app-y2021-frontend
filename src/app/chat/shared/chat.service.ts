import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket) { }

  sendMessage(msg: string): void{
    this.socket.emit('message', msg);
  }

  listenToMessages(): Observable<string> {
    return this.socket
      .fromEvent<string>('messages');
  }
}
