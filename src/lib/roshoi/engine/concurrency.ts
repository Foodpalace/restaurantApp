export function assertVersion(expected: number, actual: number, label: string): void {
  if (expected !== actual) {
    throw Object.assign(
      new Error(`Another employee changed this ${label}. Refresh before continuing.`),
      { code: "CONFLICT", status: 409 },
    );
  }
}

export function nextVersion(current: number): number {
  return current + 1;
}
