import { Exclude, Expose } from 'class-transformer';
import { IMetrics } from '../interfaces/metrics.interface';

@Exclude()
export class MetricsResponse {
  @Expose()
  public readonly sent_emails_error_counter: number;

  @Expose()
  public readonly subscription_counter: number;

  @Expose()
  public readonly unsubscription_counter: number;

  @Expose()
  public readonly rate_gauge: number;

  @Expose()
  public readonly sent_emails_counter: number;

  constructor(metrics: IMetrics) {
    Object.assign(this, metrics);
  }
}
