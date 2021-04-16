import {Stock} from '../shared/stock.model';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {ListenForAllStocks, ListenForStockDeletion, ListenForStockUpdate, StopListeningForStocks, UpdateStocks} from './stock.actions';
import {StockService} from '../shared/stock.service';
import {Subscription} from 'rxjs';

export interface StockStateModel {
  stocks: Stock[];
}

@State<StockStateModel>({
  name: 'stock',
  defaults: {
    stocks: []
  }
})

@Injectable()
export class StockState {

  private stocksUnsub: Subscription;

  constructor(private stockService: StockService) {
  }

  @Selector()
  static stocks(state: StockStateModel): Stock[] {
    return state.stocks;
  }

  @Action(ListenForAllStocks)
  listenForAllStocks(ctx: StateContext<StockStateModel>): void {
    this.stocksUnsub = this.stockService.listenForAllStocks()
      .subscribe(readStocks => {
        ctx.dispatch(new UpdateStocks(readStocks));
      });
  }

  @Action(ListenForStockUpdate)
  listenForStockUpdate(ctx: StateContext<StockStateModel>): void {
    this.stocksUnsub = this.stockService.listenForStockUpdate()
      .subscribe(stock => {
        const state = ctx.getState();
        const stocks = [...state.stocks];
        const index = stocks.findIndex((s) => s.id === stock.id);
        stocks[index] = stock;
        /*stockUpdated.currentValue = stock.currentValue;
        stockUpdated.dateOfCurrentValue = stock.dateOfCurrentValue;
        stockUpdated.dateOfOldValue = stock.dateOfOldValue;
        stockUpdated.oldValue = stock.oldValue;*/
        ctx.dispatch(new UpdateStocks(stocks));
      });
  }

  @Action(ListenForStockDeletion)
  listenForStockDeletion(ctx: StateContext<StockStateModel>): void {
    this.stocksUnsub = this.stockService.listenForStockDeletion()
      .subscribe(stock => {
        const state = ctx.getState();
        let stocks = [...state.stocks];
        stocks = stocks.filter((s) => s.id !== stock.id);
        ctx.dispatch(new UpdateStocks(stocks));
      });
  }

  @Action(UpdateStocks)
  updateStocks(ctx: StateContext<StockStateModel>, us: UpdateStocks): void {
    const state = ctx.getState();
    const newState: StockStateModel = {
      ...state,
      stocks: us.stocks
    };
    ctx.setState(newState);
  }

  @Action(StopListeningForStocks)
  stopListeningForStocks(ctx: StateContext<StockStateModel>): void {
    if (this.stocksUnsub) {
      this.stocksUnsub.unsubscribe();
    }
  }

}
