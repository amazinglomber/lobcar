import React from 'react';
import clsx from 'clsx';
import { Link, LinkProps } from 'remix';
import {
  ButtonProps, containedStyle, mainStyle, outlinedStyle,
} from '~/components/Button';

export interface LinkButtonProps extends LinkProps {
  variant?: ButtonProps['variant'];
}

const LinkButton: React.FC<LinkButtonProps> = ({
  variant = 'outlined', children, className, ...other
}) => (
  <Link
    className={clsx(
      mainStyle,
      variant === 'contained' && containedStyle,
      variant === 'outlined' && outlinedStyle,
      className,
    )}
    {...other}
  >
    {children}
  </Link>
);

export default LinkButton;
