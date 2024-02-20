import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DeleteEmailResponse {
  @Expose()
  public readonly deleted: boolean;

  constructor(deleted: boolean) {
    this.deleted = deleted;
  }
}
