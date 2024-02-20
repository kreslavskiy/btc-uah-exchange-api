import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DeleteEmailResponse {
  @Expose()
  public readonly deleted: boolean;

  public constructor(deleted: boolean) {
    this.deleted = deleted;
  }
}