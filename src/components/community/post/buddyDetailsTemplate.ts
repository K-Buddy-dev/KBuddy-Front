const textNode = (text: string) => ({
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text,
  type: 'text',
  version: 1,
});

const paragraphNode = (text: string) => ({
  children: text ? [textNode(text)] : [],
  direction: 'ltr',
  format: '',
  indent: 0,
  type: 'paragraph',
  version: 1,
});

export const BUDDY_DETAILS_TEMPLATE_LINES = [
  'Nationality :',
  'Location 📍:',
  'Languages 🗣 :',
  '',
  'Interests ❤️ :',
  '',
  'Looking For :',
];

export const createBuddyDetailsTemplate = () =>
  JSON.stringify({
    root: {
      children: BUDDY_DETAILS_TEMPLATE_LINES.map(paragraphNode),
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  });
