import React from "react";

interface SIHKAIconProps {
  isSelected: boolean;
}

const SIHKAIcon: React.FC<SIHKAIconProps> = ({ isSelected }) => {
  const iconColor = isSelected ? "#25185A" : "#FFFFFF";

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.7218 17.4121C18.1418 19.0911 15.1128 20.0011 12.0018 20.0011C8.8908 20.0011 5.8618 19.0911 3.2818 17.4121L1.8418 18.8511C4.8218 20.8921 8.3718 22.0011 12.0018 22.0011C15.6318 22.0011 19.1818 20.8921 22.1618 18.8511L20.7218 17.4121Z" fill="#FAD605"/>
<path d="M12.0023 18.002C15.0953 18.002 17.6023 15.496 17.6023 12.403C17.6023 8.40295 12.0023 2.00195 12.0023 2.00195C12.0023 2.00195 6.40234 8.40295 6.40234 12.403C6.40234 13.1383 6.5472 13.8665 6.82864 14.5458C7.11008 15.2252 7.52259 15.8425 8.04261 16.3624C8.56263 16.8823 9.17998 17.2947 9.85939 17.576C10.5388 17.8574 11.267 18.0021 12.0023 18.002ZM12.0023 14.252C12.599 14.2517 13.1711 14.0146 13.593 13.5927C14.0149 13.1708 14.2521 12.5986 14.2523 12.002H15.7523C15.7515 12.9963 15.3562 13.9496 14.6531 14.6527C13.95 15.3558 12.9967 15.7512 12.0023 15.752V14.252Z" fill={iconColor}/>
</svg>
);
};

export default SIHKAIcon;
