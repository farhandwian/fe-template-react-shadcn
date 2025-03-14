import React from "react";

interface ChevronUpIconProps {
  isSelected: boolean;
}

const ChevronUpIcon: React.FC<ChevronUpIconProps> = ({ isSelected }) => {
  const iconColor = isSelected ? "#25185A" : "#FFFFFF";

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.9378 10.0605L8.56967 4.963C8.49926 4.88088 8.41192 4.81496 8.31364 4.76977C8.21536 4.72457 8.10847 4.70117 8.0003 4.70117C7.89212 4.70117 7.78523 4.72457 7.68695 4.76977C7.58867 4.81496 7.50133 4.88088 7.43092 4.963L3.0628 10.0605C2.64592 10.5471 2.99155 11.2986 3.63217 11.2986H12.3697C13.0103 11.2986 13.3559 10.5471 12.9378 10.0605Z" fill={iconColor} stroke={iconColor} stroke-width="1.00189"/>
</svg>


  );
};

export default ChevronUpIcon;
