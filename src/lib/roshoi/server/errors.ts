export class AppError extends Error {
  readonly code: string;
  readonly status: number;
  constructor(code: string, message: string, status = 400) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
  }
}

export function asErrorMessage(err: unknown): string {
  if (err instanceof AppError) return err.message;
  if (err instanceof Error) return err.message;
  return "Your action was not completed.";
}

export function isConflict(err: unknown): boolean {
  return (
    (err instanceof AppError && err.code === "CONFLICT") ||
    (err instanceof Error && (err as { code?: string }).code === "CONFLICT")
  );
}
