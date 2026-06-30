import { FaInstagram } from 'react-icons/fa';

const INSTAGRAM_URL = 'https://www.instagram.com/kbuddy_official/';

interface InstagramFloatingButtonProps {
  hasBottomNavigation: boolean;
  avoidCommunityPostAction: boolean;
}

export function InstagramFloatingButton({
  hasBottomNavigation,
  avoidCommunityPostAction,
}: InstagramFloatingButtonProps) {
  const bottomClass = avoidCommunityPostAction ? 'bottom-[156px]' : hasBottomNavigation ? 'bottom-24' : 'bottom-6';

  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on Instagram"
      title="Instagram DM"
      className={`fixed right-4 ${bottomClass} z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] text-white shadow-lg transition-transform hover:scale-105 active:scale-95 sm:right-[calc(50%-300px+16px)]`}
    >
      <FaInstagram className="h-6 w-6" aria-hidden="true" />
    </a>
  );
}
