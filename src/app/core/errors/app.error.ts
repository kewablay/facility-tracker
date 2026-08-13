export class AppError extends Error {
  constructor(
    message: string,
    readonly status: number | null = null,
    cause?: unknown,
  ) {
    super(message, { cause });
    this.name = 'AppError';
  }
}
