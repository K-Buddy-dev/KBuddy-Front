interface LeftArrowTriangleProps {
  isDisabled?: boolean;
}

export const LeftArrowTriangle = ({ isDisabled }: LeftArrowTriangleProps) => {
  return (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="arrow_triangle / left">
        <path
          id="Vector"
          d="M14.5 7.66992L9.5 12.6699L14.5 17.6699V7.66992Z"
          fill={isDisabled ? '#B1B1B1' : '#222222'}
        />
      </g>
    </svg>
  );
};
