import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'contained' | 'outlined' | 'text';
}

const Button = ({ children, variant = 'contained', className, ...other }: ButtonProps) => {
  const containedStyle = 'bg-blue-500 hover:bg-blue-600/90 text-white border-1 border-blue-700 ';
  const outlinedStyle = 'border-2 border-blue-500 ';

  return (
    <button
      className={`
        py-2 px-4 my-1 active:scale-[0.97] transition ease-linear rounded-lg 
        ${variant === 'contained' ? containedStyle : outlinedStyle} 
        ${className}
      `.trim()}
      {...other}
    >
      {children}
    </button>
  );
};

export default Button;
