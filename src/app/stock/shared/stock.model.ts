export interface Stock  {
  id?: number;
  name: string;
  description: string;
  oldValue?: number;
  dateOfOldValue?: Date;
  currentValue: number;
  dateOfCurrentValue: Date;
}
