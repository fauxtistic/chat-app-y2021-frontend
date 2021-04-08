import {Component, OnDestroy, OnInit} from '@angular/core';
import {StockService} from './shared/stock.service';
import {Stock} from './shared/stock.model';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit, OnDestroy {

  stockValueFormControl = new FormControl(0);
  error$: Observable<string>;
  unsubscriber$ = new Subject();
  stocks: Stock[] = [];
  selectedStock: Stock;

  constructor(private stockService: StockService) { }

  ngOnInit(): void {
    this.stockService.listenForAllStocks()
      .pipe(
        takeUntil(this.unsubscriber$)
      )
      .subscribe(stocks => {
        this.stocks = stocks;
      });
    const date = new Date();
    this.stockService.requestAllStocks(date);
    this.stockService.listenForStockUpdate()
      .pipe(
        takeUntil(this.unsubscriber$)
      )
      .subscribe(stock => {
        const stockUpdated = this.stocks.find((s) => s.id === stock.id);
        stockUpdated.currentValue = stock.currentValue;
        stockUpdated.dateOfCurrentValue = stock.dateOfCurrentValue;
        stockUpdated.dateOfOldValue = stock.dateOfOldValue;
        stockUpdated.oldValue = stock.oldValue;
      });
    this.stockService.listenForStockDeletion()
      .pipe(
        takeUntil(this.unsubscriber$)
      )
      .subscribe(stock => {
        console.log('notice received');
        this.stocks = this.stocks.filter((s) => s.id !== stock.id);
        this.selectedStock = null;
      });
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
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
  }

}
