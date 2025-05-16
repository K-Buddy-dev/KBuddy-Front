interface AddAPhotoIconProps {
  className?: string;
  onClick?: () => void;
}

export const AddAPhotoIcon = ({ className, onClick }: AddAPhotoIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      className={className}
      onClick={onClick}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.3321 8.1465H12.1101V6.1465H16.4001C17.1149 6.1465 17.7759 6.54742 18.0969 7.20396L18.4682 7.9465H21.3501C22.4024 7.9465 23.2501 8.79421 23.2501 9.8465V20.6465C23.2501 21.6988 22.4024 22.5465 21.3501 22.5465H7.15012C6.09783 22.5465 5.25012 21.6988 5.25012 20.6465V13.3465H7.25012V20.5465H21.2501V9.9465H17.2321L16.3321 8.1465Z"
        fill="#222222"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.2501 13.3465C13.1456 13.3465 12.2501 14.2419 12.2501 15.3465C12.2501 16.4511 13.1456 17.3465 14.2501 17.3465C15.3547 17.3465 16.2501 16.4511 16.2501 15.3465C16.2501 14.2419 15.3547 13.3465 14.2501 13.3465ZM10.2501 15.3465C10.2501 13.1374 12.041 11.3465 14.2501 11.3465C16.4593 11.3465 18.2501 13.1374 18.2501 15.3465C18.2501 17.5556 16.4593 19.3465 14.2501 19.3465C12.041 19.3465 10.2501 17.5556 10.2501 15.3465Z"
        fill="#222222"
      />
      <path fillRule="evenodd" clipRule="evenodd" d="M2.25012 6.1465H10.2501V8.1465H2.25012V6.1465Z" fill="#222222" />
      <path fillRule="evenodd" clipRule="evenodd" d="M5.25012 11.3465V3.3465H7.25012V11.3465H5.25012Z" fill="#222222" />
    </svg>
  );
};
