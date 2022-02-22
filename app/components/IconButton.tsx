import React from 'react';

export interface IconButtonProps {
  onClick: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ children, onClick }) => {
  return (
    <div
      className="flex items-center justify-center p-4 cursor-pointer text-2xl"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default IconButton;
