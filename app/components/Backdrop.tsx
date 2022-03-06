import React from 'react';
import clsx from 'clsx';

interface BackdropProps {
  className?: string;
}

const Backdrop: React.FC<BackdropProps> = ({ className, children }) => (
  <div
    className={clsx(
      'before:opacity-0',
      'fixed inset-0 w-full h-full bg-gray-700 opacity-100 bg-opacity-50 transition',
      className,
    )}
  >
    {children}
  </div>
);

export default Backdrop;
