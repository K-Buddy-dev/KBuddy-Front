import { NATIONALITIES } from './nationalities';

it('offers a broad country list for signup nationality selection', () => {
  expect(NATIONALITIES[0]).toEqual({ label: 'Prefer not to say', value: '' });
  expect(NATIONALITIES.length).toBeGreaterThan(190);
  expect(NATIONALITIES).toEqual(
    expect.arrayContaining([
      { label: 'South Korea', value: 'KR' },
      { label: 'United States', value: 'US' },
      { label: 'Vietnam', value: 'VN' },
      { label: 'Philippines', value: 'PH' },
      { label: 'Thailand', value: 'TH' },
      { label: 'Indonesia', value: 'ID' },
    ])
  );
});
