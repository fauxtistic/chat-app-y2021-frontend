import { Injectable } from '@angular/core';
import {StockSocket} from '../../app.module';
import {Observable} from 'rxjs';
import {Stock} from './stock.model';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private socket: StockSocket) {}

  listenForAllStocks(): Observable<Stock[]> {
    return this.socket
      .fromEvent<Stock[]>('allStocks');
  }

  listenForStockUpdate(): Observable<Stock> {
    return this.socket
      .fromEvent<Stock>('stockUpdated');
  }

  listenForStockDeletion(): Observable<Stock> {
    return this.socket
      .fromEvent<Stock>('stockDeleted');
  }

  requestAllStocks(date: Date): void {
    this.socket.emit('requestStocks', date);
  }

  updateStock(stock: Stock, date: Date): void {
    this.socket.emit('updateStock', {stock, date});
  }

  deleteStock(stock: Stock): void {
    this.socket.emit('deleteStock', stock);
  }
}
