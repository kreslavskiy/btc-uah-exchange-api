export interface IGetExchangeRateResult {
  readonly time: string;

  readonly asset_id_base: string;

  readonly asset_id_quote: string;

  readonly rate: number;
}
