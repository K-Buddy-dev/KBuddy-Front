interface AlarmIconProps {
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}

export function AlarmIcon({ isActive = false, className, onClick }: AlarmIconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
    >
      <path
        d="M11.9971 4C14.7571 4 16.9971 6.24 16.9971 9V14.47L17.2071 14.89L17.7571 16H6.23714L6.78714 14.89L6.99714 14.47V9C6.99714 6.24 9.23714 4 11.9971 4ZM11.9971 2C8.14714 2 4.99714 5.15 4.99714 9V14L3.72714 16.55C3.39714 17.21 3.87714 18 4.61714 18H19.3771C20.1171 18 20.6071 17.22 20.2671 16.55L18.9871 14V9C18.9871 5.15 15.8371 2 11.9871 2H11.9971Z"
        fill={isActive ? '#6563FF' : '#6d6d6d'}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.99714 18C9.99714 19.1077 10.8894 20 11.9971 20C13.1049 20 13.9971 19.1077 13.9971 18H15.9971C15.9971 20.2123 14.2094 22 11.9971 22C9.78485 22 7.99714 20.2123 7.99714 18H9.99714Z"
        fill={isActive ? '#6563FF' : '#6d6d6d'}
      />
    </svg>
  );
}
