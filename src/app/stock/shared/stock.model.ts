export interface Stock  {
  id?: string;
  name: string;
  description: string;
  oldValue?: number;
  dateOfOldValue?: Date;
  currentValue: number;
  dateOfCurrentValue: Date;
}
