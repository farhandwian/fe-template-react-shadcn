import React from "react";

interface PDAIconProps {
  isSelected?: boolean;
}

const PDAIcon: React.FC<PDAIconProps> = ({ isSelected }) => {
  const iconColor = isSelected ? "#FAD605" : "#FFFFFF";

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.0875 3.33192C11.0211 3.26306 10.9399 3.21035 10.8499 3.17784C10.76 3.14534 10.6638 3.1339 10.5687 3.14442C11.2958 4.20836 11.7448 5.43739 11.875 6.71942C11.8934 8.06554 11.3775 9.36408 10.4403 10.3306C9.50311 11.297 8.22105 11.8526 6.875 11.8757C6.13836 11.8746 5.41165 11.7057 4.75 11.3819C4.52526 11.9372 4.39839 12.5271 4.375 13.1257C4.375 14.7833 5.03348 16.373 6.20558 17.5451C7.37769 18.7172 8.9674 19.3757 10.625 19.3757C12.2826 19.3757 13.8723 18.7172 15.0444 17.5451C16.2165 16.373 16.875 14.7833 16.875 13.1257C16.875 9.87567 11.6812 3.99442 11.0875 3.33192Z" fill={iconColor}/>
<path d="M10.6241 6.70708C10.6241 4.72583 7.68657 1.22583 7.34907 0.832079C7.29039 0.763467 7.21755 0.708381 7.13555 0.67061C7.05355 0.632839 6.96434 0.613281 6.87407 0.613281C6.78379 0.613281 6.69458 0.632839 6.61258 0.67061C6.53058 0.708381 6.45774 0.763467 6.39907 0.832079C6.06157 1.25083 3.12407 4.72583 3.12407 6.70708C3.11245 7.21075 3.20029 7.71178 3.38255 8.18146C3.56482 8.65114 3.83793 9.08027 4.18625 9.44427C4.53457 9.80827 4.95127 10.1 5.41248 10.3027C5.87369 10.5055 6.37037 10.6153 6.87407 10.6258C7.37776 10.6153 7.87444 10.5055 8.33565 10.3027C8.79686 10.1 9.21356 9.80827 9.56188 9.44427C9.9102 9.08027 10.1833 8.65114 10.3656 8.18146C10.5478 7.71178 10.6357 7.21075 10.6241 6.70708Z" fill={iconColor}/>
</svg>

  );
};

export default PDAIcon;
