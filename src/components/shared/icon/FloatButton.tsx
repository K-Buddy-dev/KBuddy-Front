export function FloatLeft() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="40" width="40" height="40" rx="20" transform="rotate(180 40 40)" fill="#F6F4FE" />
      <rect x="39.5" y="39.5" width="39" height="39" rx="19.5" transform="rotate(180 39.5 39.5)" stroke="#E2DEFD" />
      <path d="M22.295 26L23.705 24.59L19.125 20L23.705 15.41L22.295 14L16.295 20L22.295 26Z" fill="#222222" />
    </svg>
  );
}

export function FloatRight() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="40" height="40" rx="20" fill="#F6F4FE" />
      <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="#E2DEFD" />
      <path d="M17.705 14L16.295 15.41L20.875 20L16.295 24.59L17.705 26L23.705 20L17.705 14Z" fill="#222222" />
    </svg>
  );
}

export function FloatPostAction() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_dd_4263_69385)">
        <g clipPath="url(#clip0_4263_69385)">
          <rect x="0" y="0" width="40" height="40" rx="12" fill="#F6F4FE" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M27.06 11.59L28.41 12.94C29.2 13.72 29.2 14.99 28.41 15.77L15.18 29H11V24.82L21.4 14.41L24.23 11.59C25.01 10.81 26.28 10.81 27.06 11.59ZM13 27L14.41 27.06L24.23 17.23L22.82 15.82L13 25.64V27Z"
            fill="#6952F9"
          />
        </g>
        <rect x="0.5" y="0.5" width="39" height="39" rx="11.5" stroke="#E2DEFD" />
      </g>
      <defs>
        <filter
          id="filter0_dd_4263_69385"
          x="-16"
          y="-8"
          width="72"
          height="72"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="8" />
          <feGaussianBlur stdDeviation="8" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4263_69385" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="2" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_4263_69385" result="shape" />
        </filter>
        <clipPath id="clip0_4263_69385">
          <rect x="0" y="0" width="40" height="40" rx="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
