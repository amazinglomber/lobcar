import React from 'react';
import useTheme from '~/hooks/useTheme';

const DarkModeSwitch = () => {
  const { switchTheme } = useTheme();

  return (
    <button className="m-4" onClick={() => switchTheme()}>
      dark mode
    </button>
  );
};

export default DarkModeSwitch;
