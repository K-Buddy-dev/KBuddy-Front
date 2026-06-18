import { BUDDY_DETAILS_TEMPLATE_LINES, createBuddyDetailsTemplate } from './buddyDetailsTemplate';

it('uses the concise Buddy details labels without example bullets', () => {
  expect(BUDDY_DETAILS_TEMPLATE_LINES).toEqual([
    'Nationality :',
    'Location 📍:',
    'Languages 🗣 :',
    '',
    'Interests ❤️ :',
    '',
    'Looking For :',
  ]);

  const template = createBuddyDetailsTemplate();

  expect(template).not.toContain('Language exchange');
  expect(template).not.toContain('Local friends');
  expect(template).not.toContain('Hobby buddies');
});
