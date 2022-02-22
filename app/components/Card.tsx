import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className }: CardProps) => {
  return (
    <div className={"p-2 lg:p-6 shadow rounded-xl max-h-fit dark:bg-surface-dp2 transition duration-500 " + (className ?? '')}>
      {children}
    </div>
  );
};

export default Card;
