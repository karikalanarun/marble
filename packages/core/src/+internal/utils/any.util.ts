export const isNonNullable = <T>(value: T): value is NonNullable<T> =>
  value !== undefined && value !== null;

export const isNullable = <T>(value: T) =>
  !isNonNullable(value);
