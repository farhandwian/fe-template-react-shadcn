import React from "react";

interface ChevronDownIconProps {
  isSelected: boolean;
}

const ChevronDownIcon: React.FC<ChevronDownIconProps> = ({ isSelected }) => {
  const iconColor = isSelected ? "#25185A" : "#FFFFFF";

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.06167 5.9393L7.42979 11.0368C7.5002 11.1189 7.58754 11.1848 7.68582 11.23C7.7841 11.2752 7.89099 11.2986 7.99917 11.2986C8.10734 11.2986 8.21423 11.2752 8.31251 11.23C8.41079 11.1848 8.49813 11.1189 8.56854 11.0368L12.9367 5.9393C13.3535 5.45273 13.0079 4.70117 12.3673 4.70117H3.62979C2.98917 4.70117 2.64354 5.45273 3.06167 5.9393Z" fill={iconColor} stroke={iconColor} stroke-width="1.00189"/>
</svg>



  );
};

export default ChevronDownIcon;
