import React from 'react';
import useTheme from '~/hooks/useTheme';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import IconButton from '~/components/IconButton';
import clsx from 'clsx';

const DarkModeSwitch = () => {
  const { switchTheme, mode } = useTheme();

  function handleClick() {
    switchTheme();
  }

  return (
    <IconButton
      onClick={handleClick}
    >
      <MdDarkMode
        className={clsx(
          'absolute transition',
          mode === 'dark' ? 'opacity-0' : 'text-black',
        )}
      />
      <MdLightMode
        className={clsx(
          'transition',
          mode === 'light' ? 'opacity-0' : 'text-white',
        )}
      />
    </IconButton>
  );
};

export default DarkModeSwitch;
