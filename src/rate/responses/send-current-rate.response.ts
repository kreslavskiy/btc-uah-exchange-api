import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SendCurrentRateResponse {
  @Expose()
  public readonly sent: boolean;

  constructor(sent: boolean) {
    this.sent = sent;
  }
}
