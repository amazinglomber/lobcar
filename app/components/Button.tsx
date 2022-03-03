import clsx from 'clsx';
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'contained' | 'outlined' | 'text';
}

export const mainStyle = 'py-2 px-4 my-1 active:scale-[0.97] transition ease-linear rounded-lg';
export const containedStyle = 'border-1 border-blue-700 bg-primary hover:bg-blue-600/90 text-white';
const outlinedStyle = 'border-2 border-primary hover:bg-primary/10 ';

function Button({
  children, variant = 'contained', type = 'button', value, disabled, className, ...other
}: ButtonProps) {
  return (
    <button
      className={clsx(
        mainStyle,
        variant === 'contained' ? containedStyle : outlinedStyle,
        disabled && 'border-gray-500 text-gray-500 bg-gray-500/10 hover:bg-gray-500/10',
        className,
      )}
      disabled={disabled}
      type={type}
      value={value}
      {...other}
    >
      {children}
    </button>
  );
}

export default React.memo(Button);
