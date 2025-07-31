import type { ReactNode, FC } from "react";

interface BaseHeaderProps {
  children: ReactNode;
  className?: string;
  offset?: number;
}

const BaseHeader: FC<BaseHeaderProps> = ({ children }: BaseHeaderProps) => {
  return (
    <header
      className={`w-full h-fit shadow-md flex justify-between items-center bg-white transition-transform duration-300
      }`}
    >
      {children}
    </header>
  );
};

export default BaseHeader;
