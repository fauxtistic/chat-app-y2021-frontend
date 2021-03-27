import { BrowserModule } from '@angular/platform-browser';
import {Injectable, NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {Socket, SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SharedModule} from './shared/shared.module';

@Injectable()
export class ChatSocket extends Socket {

  constructor() {
    super({url: 'http://localhost:3000', options: {}});
  }

}

@Injectable()
export class StockSocket extends Socket {

  constructor() {
    super({url: 'http://localhost:3100', options: {}});
  }

}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule,
    BrowserAnimationsModule,
    SharedModule,
  ],
  providers: [ChatSocket, StockSocket],
  bootstrap: [AppComponent]
})
export class AppModule { }
