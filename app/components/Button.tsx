import clsx from 'clsx';
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'contained' | 'outlined' | 'text';
}

const Button = ({ children, variant = 'contained', disabled, className, ...other }: ButtonProps) => {
  const containedStyle = 'border-1 border-blue-700 bg-primary hover:bg-blue-600/90 text-white';
  const outlinedStyle = 'border-2 border-primary hover:bg-primary/10 ';

  return (
    <button
      className={clsx(
        'py-2 px-4 my-1 active:scale-[0.97] transition ease-linear rounded-lg',
        variant === 'contained' ? containedStyle : outlinedStyle,
        disabled && 'border-gray-500 text-gray-500 bg-gray-500/10 hover:bg-gray-500/10',
        className,
      )}
      disabled={disabled}
      {...other}
    >
      {children}
    </button>
  );
};

export default Button;
