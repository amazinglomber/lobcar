import React from 'react';
import clsx from 'clsx';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className }: CardProps) {
  return (
    <div
      className={clsx(
        'p-2 lg:p-6 bg-white dark:bg-surface-dp2 shadow rounded-xl max-h-fit transition duration-500',
        className,
      )}
    >
      {children}
    </div>
  );
}

export default React.memo(Card);
