export class EmailError extends Error {
  constructor(name: string, message: string) {
    super(message);
    this.name = name;
  };

  public static AlreadyExists(): EmailError {
    return new EmailError('EMAIL_ALREADY_EXISTS', 'E-mail already exists');
  }

  public static NotFound(): EmailError {
    return new EmailError('EMAIL_NOT_FOUND', 'E-mail not found');
  }
}