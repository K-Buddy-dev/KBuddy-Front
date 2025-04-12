interface RightArrowTriangleProps {
  isDisabled?: boolean;
}

export const RightArrowTriangle = ({ isDisabled }: RightArrowTriangleProps) => {
  return (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="arrow_triangle / right">
        <path
          id="Vector"
          d="M9.5 17.6699L14.5 12.6699L9.5 7.66992V17.6699Z"
          fill={isDisabled ? '#B1B1B1' : '#222222'}
        />
      </g>
    </svg>
  );
};
