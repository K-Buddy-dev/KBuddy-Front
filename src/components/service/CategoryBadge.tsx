interface CategoryBadgeProps {
  type: '1:1 Chat' | 'Group';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ type }) => {
  return (
    <div
      className="flex flex-col justify-center items-center gap-2 rounded-lg"
      style={{ background: 'rgba(17, 17, 17, 0.70)', backdropFilter: 'blur(2px)' }}
    >
      <div className="flex py-1.5 px-2 justify-center items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5.39016 8.58929C6.47547 8.58929 7.35528 7.70948 7.35528 6.62417C7.35528 5.53887 6.47547 4.65906 5.39016 4.65906C4.30486 4.65906 3.42505 5.53887 3.42505 6.62417C3.42505 7.70948 4.30486 8.58929 5.39016 8.58929Z"
            fill="white"
          />
          <path
            d="M1.52554 13.6064C1.16527 13.6064 0.903256 13.1806 1.03426 12.7941C1.72205 10.7897 3.41205 9.37482 5.38372 9.37482C7.35539 9.37482 9.04539 10.7897 9.73318 12.7941C9.86419 13.1871 9.60217 13.6064 9.2419 13.6064H1.52554Z"
            fill="white"
          />
          <path
            d="M11.9553 6.57914C11.7104 7.57303 10.5905 7.895 10.1145 7.99298C10.0375 8.00698 9.99555 7.91599 10.0515 7.867C10.4365 7.47504 10.4365 6.57914 10.4365 6.57914H9.47061C9.26063 6.57914 9.09265 6.41116 9.09265 6.20119V2.77157C9.09265 2.5616 9.26063 2.39362 9.47061 2.39362H14.622C14.832 2.39362 15 2.5616 15 2.77157V6.19419C15 6.40416 14.832 6.57214 14.622 6.57214H11.9623L11.9553 6.57914Z"
            fill="white"
          />
        </svg>
        <span className="text-text-inverted-default text-center font-roboto text-label-300-heavy font-medium leading-3 tracking-[0.24px]">
          {type}
        </span>
      </div>
    </div>
  );
};
