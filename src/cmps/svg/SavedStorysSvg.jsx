
export const SavedStorysSvg = ({ width = 12, height = 12, color = 'currentColor', ariaLabel = '' }) => (
  <svg
    aria-label={ariaLabel}
    className="icon-profile"
    fill={color}
    height={height}
    role="img"
    viewBox="0 0 24 24"
    width={width}
    
  >
    <polygon
      fill="none"
      points="20 21 12 13.44 4 21 4 3 20 3 20 21"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    ></polygon>
  </svg>
);

