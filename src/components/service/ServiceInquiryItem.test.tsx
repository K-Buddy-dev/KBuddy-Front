import { screen } from '@testing-library/react';
import render from '@/utils/test/render';
import { ServiceInquiryItem } from './ServiceInquiryItem';

it('shows loaded secret inquiry content instead of masking it again on the frontend', async () => {
  await render(
    <ServiceInquiryItem
      detail={{
        content: 'Please keep this private, but I need help with visa documents.',
        createdAt: '2026-06-03T10:00:00Z',
        inquiryId: 1,
        isSecret: true,
        replies: [],
        title: 'Private visa question',
        writerName: 'Customer',
      }}
      inquiry={{
        createdAt: '2026-06-03T10:00:00Z',
        inquiryId: 1,
        isSecret: true,
        title: 'Private visa question',
        writerName: 'Customer',
      }}
      isExpanded
      isLoadingDetail={false}
      onReply={vi.fn()}
      onReplyDraftChange={vi.fn()}
      onSelect={vi.fn()}
      onSubmitReply={vi.fn()}
      replyDraft=""
      replyingTo={null}
    />
  );

  expect(screen.getByText('Please keep this private, but I need help with visa documents.')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Private visa question' })).toBeInTheDocument();
  expect(screen.getByText('Private visa question')).toBeInTheDocument();
  expect(screen.queryByText('Private inquiry')).not.toBeInTheDocument();
  expect(screen.queryByText('Private comment')).not.toBeInTheDocument();
});

it('shows an answered badge before expanding an inquiry with replies', async () => {
  await render(
    <ServiceInquiryItem
      inquiry={{
        createdAt: '2026-06-03T10:00:00Z',
        inquiryId: 2,
        isSecret: false,
        replyCount: 1,
        title: 'Can I book this weekend?',
        writerName: 'Customer',
      }}
      isExpanded={false}
      isLoadingDetail={false}
      onReply={vi.fn()}
      onReplyDraftChange={vi.fn()}
      onSelect={vi.fn()}
      onSubmitReply={vi.fn()}
      replyDraft=""
      replyingTo={null}
    />
  );

  expect(screen.getByText('Answered')).toBeInTheDocument();
});
