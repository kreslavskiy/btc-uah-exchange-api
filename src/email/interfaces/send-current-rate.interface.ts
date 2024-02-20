export interface ISendCurrentRate {
  readonly email: string;

  readonly rate: number;

  readonly date: Date;

  readonly message?: string;
}
