import { Message } from '@/types/message';

interface MessageListItemProps {
  message: Message;
  onClick?: () => void;
}

function BusinessMarkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.44853 0.925599C5.68591 0.51002 6.28512 0.51002 6.5225 0.925599L7.05959 1.86588C7.20952 2.12835 7.52721 2.24398 7.81077 2.13929L8.82661 1.76423C9.27558 1.59846 9.7346 1.98362 9.64932 2.45456L9.45635 3.5201C9.40249 3.81753 9.57153 4.11031 9.85605 4.21238L10.8753 4.57804C11.3258 4.73965 11.4298 5.32975 11.0618 5.63569L10.2291 6.3279C9.99662 6.52113 9.93791 6.85407 10.0903 7.11514L10.636 8.05042C10.8772 8.46379 10.5776 8.98272 10.099 8.98051L9.01618 8.9755C8.71391 8.97411 8.45493 9.19142 8.40381 9.48934L8.22071 10.5566C8.13978 11.0283 7.57671 11.2333 7.21151 10.9239L6.38521 10.2241C6.15455 10.0287 5.81647 10.0287 5.58582 10.2241L4.75952 10.9239C4.39432 11.2333 3.83125 11.0283 3.75032 10.5566L3.56722 9.48934C3.5161 9.19142 3.25712 8.97411 2.95485 8.9755L1.872 8.98051C1.3934 8.98272 1.0938 8.46379 1.33501 8.05042L1.88077 7.11514C2.03312 6.85407 1.97441 6.52113 1.74196 6.3279L0.909229 5.63569C0.541184 5.32975 0.645235 4.73965 1.09572 4.57804L2.11498 4.21238C2.3995 4.11031 2.56854 3.81753 2.51468 3.5201L2.32171 2.45456C2.23643 1.98362 2.69545 1.59846 3.14442 1.76423L4.16026 2.13929C4.44382 2.24398 4.76151 2.12835 4.91144 1.86588L5.44853 0.925599Z"
        fill="#30FF21"
      />
      <path
        d="M5.00001 8.34999L3.00001 6.34999L3.70001 5.64999L5.00001 6.94999L8.07878 3.87122L8.77877 4.57122L5.00001 8.34999Z"
        fill="#222222"
      />
    </svg>
  );
}

function UnreadIndicator() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="4" r="4" fill="#D31510" />
    </svg>
  );
}

export function MessageListItem({ message, onClick }: MessageListItemProps) {
  return (
    <div
      className={`flex flex-col gap-2.5 p-4 border-b border-border-weak1 cursor-pointer ${
        message.isRead ? 'bg-bg-highlight-default' : 'bg-bg-brand-weak'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center gap-4 flex-1">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full border border-white overflow-hidden flex-shrink-0">
            <img src={message.avatar} alt={message.userId} className="w-full h-full object-cover" />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            {/* Header row with ID and time */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-start gap-0.5">
                {message.hasBusinessMark && <BusinessMarkIcon />}
                <div className="flex items-start">
                  <span className="text-text-default font-semibold text-xs leading-3 tracking-[0.24px]">@ </span>
                  <span className="text-text-default font-semibold text-xs leading-3 tracking-[0.24px]">
                    {message.userId}
                  </span>
                </div>
              </div>
              <span className="text-text-weak font-medium text-xs leading-3 tracking-[0.24px] whitespace-nowrap">
                {message.time}
              </span>
            </div>

            {/* Title and preview */}
            <div className="flex flex-col gap-0.5 w-full">
              <div className="text-[#1E1F20] font-medium text-sm leading-5 tracking-[0.25px] truncate w-full">
                {message.title}
              </div>
              <div className="text-[#1E1F20] font-normal text-sm leading-5 tracking-[0.25px] truncate w-full">
                {message.preview}
              </div>
            </div>
          </div>
        </div>

        {/* Unread indicator */}
        {!message.isRead && (
          <div className="flex-shrink-0">
            <UnreadIndicator />
          </div>
        )}
      </div>
    </div>
  );
}
