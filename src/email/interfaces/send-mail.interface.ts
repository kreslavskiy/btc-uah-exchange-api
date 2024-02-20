export interface ISendMail {
  readonly to: string;

  readonly subject: string;

  readonly message: string;
}