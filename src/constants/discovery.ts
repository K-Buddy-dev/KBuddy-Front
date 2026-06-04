export type DiscoveryType = 'Events' | 'Notice';

export type DiscoveryItem = {
  id: string;
  type: DiscoveryType;
  title: string;
  description: string;
  updatedAt: string;
  summary: string[];
  body: string[];
  ctaLabel: string;
  ctaHref: string;
};

export const discoveryItems: DiscoveryItem[] = [
  {
    id: '1',
    type: 'Notice',
    title: 'New to Korea? Start here',
    description: 'Read the checklist before your first booking.',
    updatedAt: 'June 3, 2026',
    summary: [
      'Prepare your passport, ARC status, and current Korean address before booking help.',
      'Choose a K-Buddy by the problem you need to solve, not only by rating.',
      'Use live chat first when you need fast guidance before an offline visit.',
    ],
    body: [
      'Moving through daily life in Korea is easier when you know which documents, apps, and local rules matter first. Before booking a session, write down the exact problem you want to solve and any deadline you are working against.',
      'K-Buddy counselors can help you understand common next steps for phone setup, housing, banking, healthcare, transportation, and everyday local services. For urgent or official issues, bring the relevant document names and screenshots so the session can stay practical.',
    ],
    ctaLabel: 'Explore related services',
    ctaHref: '/service',
  },
  {
    id: '2',
    type: 'Events',
    title: 'June live chat week',
    description: 'Find limited-time sessions and community updates.',
    updatedAt: 'June 3, 2026',
    summary: [
      'Live chat sessions are highlighted for newcomers during June.',
      'Use the event period to compare topics and find the right counselor faster.',
      'Check available time slots before sending a booking request.',
    ],
    body: [
      'June live chat week is designed for users who need quick answers about settling in Korea. Browse available counselors, choose a topic, and start with a focused request.',
      'For the best experience, include your city, the service you are trying to use, and what you have already tried. This helps the counselor respond with useful next steps instead of broad advice.',
    ],
    ctaLabel: 'Browse live chat services',
    ctaHref: '/service',
  },
  {
    id: '3',
    type: 'Notice',
    title: 'How K-Buddy sessions work',
    description: 'Learn what to prepare before requesting a counselor.',
    updatedAt: 'June 3, 2026',
    summary: [
      'Pick a counselor based on category, availability, and the task you need handled.',
      'Submit your request with context so the counselor can prepare.',
      'After confirmation, continue the conversation in chat.',
    ],
    body: [
      'A K-Buddy session starts with a clear request. The more specific your topic is, the easier it is for the counselor to help you quickly.',
      'Once your request is reviewed and confirmed, you can use the chat room to share details, ask follow-up questions, and keep the conversation organized around the booking.',
    ],
    ctaLabel: 'Find a counselor',
    ctaHref: '/service',
  },
];

export function getDiscoveryItem(id: string | undefined) {
  return discoveryItems.find((item) => item.id === id);
}
