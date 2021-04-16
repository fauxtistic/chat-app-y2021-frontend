import {Component, OnDestroy, OnInit} from '@angular/core';
import {StockService} from './shared/stock.service';
import {Stock} from './shared/stock.model';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {StockState} from './state/stock.state';
import {Select, Store} from '@ngxs/store';
import {ListenForAllStocks, ListenForStockDeletion, ListenForStockUpdate, StopListeningForStocks} from './state/stock.actions';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit, OnDestroy {

  stockValueFormControl = new FormControl(0);
  error$: Observable<string>;
  @Select(StockState.stocks)
  stocks$: Observable<Stock[]>;
  selectedStock: Stock;

  constructor(private stockService: StockService,
              private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new ListenForAllStocks());
    this.store.dispatch(new ListenForStockUpdate());
    this.store.dispatch(new ListenForStockDeletion());
    const date = new Date();
    this.stockService.requestAllStocks(date);
  }

  ngOnDestroy(): void {
    this.store.dispatch(new StopListeningForStocks());
  }

  setSelectedStock(stock: Stock): void {
    this.selectedStock = stock;
    this.stockValueFormControl.patchValue(stock.currentValue);
  }

  updateStock(): void {
    const stockToUpdate = {
      id: this.selectedStock.id,
      name: this.selectedStock.name,
      description: this.selectedStock.description,
      currentValue: this.stockValueFormControl.value,
      oldValue: this.selectedStock.oldValue,
      dateOfCurrentValue: this.selectedStock.dateOfCurrentValue,
      dateOfOldValue: this.selectedStock.dateOfOldValue
    };
    const date = new Date();
    this.stockService.updateStock(stockToUpdate, date);
  }

  deleteStock(): void {
    const stockToDelete = this.selectedStock;
    this.stockService.deleteStock(stockToDelete);
    this.selectedStock = null;
  }

}
