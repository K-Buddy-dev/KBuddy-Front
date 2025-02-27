export const BIRTH_YEAR_OPTIONS = Array.from({ length: 100 }, (_, i) => ({
  label: `${2025 - i}`,
  value: `${2025 - i}`.slice(-2),
}));

export const BIRTH_MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1}`,
  value: `${i + 1}`,
}));

export const BIRTH_DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => ({
  label: `${i + 1}`,
  value: `${i + 1}`,
}));
