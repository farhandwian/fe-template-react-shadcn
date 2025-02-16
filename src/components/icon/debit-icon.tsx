import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type Props = HTMLAttributes<SVGElement>;

const DebitIcon = (props: Props) => {
  const { className, color = "white" } = props;

  return (
    <svg
      className={cn("w-8 h-8", className)}
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.957 12.499C15.957 15.951 13.784 18.124 10.332 18.124C6.88008 18.124 4.70703 15.951 4.70703 12.499C4.70703 8.79473 8.73945 3.79395 9.97617 2.34746C10.0202 2.29607 10.0748 2.25481 10.1362 2.22653C10.1977 2.19824 10.2646 2.18359 10.3322 2.18359C10.3999 2.18359 10.4667 2.19824 10.5282 2.22653C10.5897 2.25481 10.6443 2.29607 10.6883 2.34746C11.9246 3.79395 15.957 8.79473 15.957 12.499Z"
        fill={color}
      />
      <path
        d="M13.7726 12.8125C13.7726 13.559 13.476 14.2749 12.9482 14.8027C12.4204 15.3305 11.7045 15.6271 10.958 15.6271"
        fill={color}
      />
    </svg>
  );
};

export default DebitIcon;
