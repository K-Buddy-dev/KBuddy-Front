export const BIRTH_YEAR_OPTIONS = [
  { label: 'Year', value: '' },
  ...Array.from({ length: 100 }, (_, i) => ({
    label: `${2025 - i}`,
    value: `${2025 - i}`,
  })),
];

export const BIRTH_MONTH_OPTIONS = [
  { label: 'Month', value: '' },
  ...Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1}`,
    value: `${i + 1}`,
  })),
];

export const BIRTH_DAY_OPTIONS = [
  { label: 'Day', value: '' },
  ...Array.from({ length: 31 }, (_, i) => ({
    label: `${i + 1}`,
    value: `${i + 1}`,
  })),
];
