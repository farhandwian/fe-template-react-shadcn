import React from "react";

interface ManajemenPenggunaIconProps {
  isSelected: boolean;
}

const ManajemenPenggunaIcon: React.FC<ManajemenPenggunaIconProps> = ({ isSelected }) => {
  const iconColor = isSelected ? "#25185A" : "#FFFFFF";

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.1257 6.75003C15.942 9.22867 14.0629 11.2507 12.0001 11.2507C9.93735 11.2507 8.05505 9.22913 7.87455 6.75003C7.68702 4.17154 9.51541 2.24939 12.0001 2.24939C14.4849 2.24939 16.3133 4.21842 16.1257 6.75003Z" fill="#FAD605"/>
<path d="M11.9991 14.2502C7.92101 14.2502 3.78195 16.5002 3.01601 20.7471C2.92367 21.2589 3.21336 21.7502 3.74914 21.7502H20.2491C20.7854 21.7502 21.0751 21.2589 20.9827 20.7471C20.2163 16.5002 16.0773 14.2502 11.9991 14.2502Z" fill={iconColor}/>
</svg>


  );
};

export default ManajemenPenggunaIcon;
