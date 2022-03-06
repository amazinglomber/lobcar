import React from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import clsx from 'clsx';
import useTheme from '~/hooks/useTheme';
import IconButton from '~/components/IconButton';

function DarkModeSwitch() {
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
}

export default DarkModeSwitch;
