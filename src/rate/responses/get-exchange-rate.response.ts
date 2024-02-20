import { Exclude, Expose } from 'class-transformer';
import { IRate } from '../interfaces/rate.interface';

@Exclude()
export class GetExchangeRateResponse {
  @Expose()
  public readonly date: Date;

  @Expose()
  public readonly rate: number;

  constructor(rate: IRate) {
    Object.assign(this, rate);

    this.date = new Date(rate.date);
  }
}
