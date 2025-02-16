type MarkerIconProps = {
  hasGradient?: boolean;
  status?: "online" | "offline" | "warning" | "default";
};

const MarkerIcon = (props: MarkerIconProps) => {
  const { hasGradient = false, status = "default" } = props;
  const colors = {
    online: ["#07BCCE", "#69FE97", "#5468E4"],
    offline: ["#CE072899", "#FE696B", "#E45456"],
    warning: ["#FFD600", "#FFD600", "#FFD600"],
    default: ["transparent", "transparent", "transparent"],
  };

  return (
    <svg
      width="46"
      height="118"
      viewBox="0 0 46 118"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={status !== "default" ? "animate-pulse" : ""}
    >
      <ellipse
        cx="23"
        cy="101.087"
        rx="19"
        ry="12"
        fill={colors[status][0]}
        fillOpacity="0.6"
      />
      <ellipse
        cx="23"
        cy="101.087"
        rx="14.25"
        ry="8.4"
        fill={colors[status][1]}
      />
      <g filter="url(#filter0_f_0_1)">
        <ellipse
          cx="23"
          cy="101.087"
          rx="14.25"
          ry="8.4"
          fill={colors[status][1]}
          style={{ mixBlendMode: "multiply" }}
        />
      </g>
      <ellipse
        cx="23"
        cy="101.087"
        rx="9.5"
        ry="4.8"
        fill={colors[status][2]}
      />
      <line
        x1="24"
        y1="8.74228e-08"
        x2="24"
        y2="100"
        stroke={hasGradient ? "url(#paint0_linear_0_1)" : "white"}
        strokeWidth="4"
      />
      <defs>
        <filter
          id="filter0_f_0_1"
          x="0.75"
          y="84.6865"
          width="44.5"
          height="32.8"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="4"
            result="effect1_foregroundBlur_0_1"
          />
        </filter>
        <linearGradient
          id="paint0_linear_0_1"
          x1="21.5"
          y1="-2.18557e-08"
          x2="21.5"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.25" stopColor="#00ACF6" />
          <stop offset="1" stopColor="#FAD605" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default MarkerIcon;
