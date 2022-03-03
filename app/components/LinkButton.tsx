import React from 'react';
import clsx from 'clsx';
import { Link, LinkProps } from 'remix';
import { containedStyle, mainStyle } from '~/components/Button';

export interface LinkButtonProps extends LinkProps {

}

const LinkButton: React.FC<LinkButtonProps> = ({ children, className, ...other }) => (
  <Link
    className={clsx(
      mainStyle,
      containedStyle,
      className,
    )}
    {...other}
  >
    {children}
  </Link>
);

export default LinkButton;
