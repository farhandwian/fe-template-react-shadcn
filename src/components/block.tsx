import React from "react";

type Props = {
  children?: React.ReactNode;
  icon?: React.ReactNode;
};

const Block = (props: Props) => {
  return (
    <div className="border border-red-400 p-4 rounded-lg flex items-center justify-center text-muted-foreground flex-col gap-1 bg-red-50 ">
      {props.icon}
      <span className="text-sm">{props.children}</span>
    </div>
  );
};

export default Block;
