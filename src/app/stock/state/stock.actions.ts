import {Stock} from '../shared/stock.model';

export class ListenForAllStocks {
  static readonly type = '[Stock] Listen for all stocks';
}

export class ListenForStockUpdate {
  static readonly type = '[Stock] Listen for stock update';
}

export class ListenForStockDeletion {
  static readonly type = '[Stock] Listen for stock deletion';
}

export class UpdateStocks {
  constructor(public stocks: Stock[]) {}
  static readonly type = '[Stock] Update stocks';
}

export class StopListeningForStocks {
  static readonly type = '[Stock] Stop listening for stocks';
}
