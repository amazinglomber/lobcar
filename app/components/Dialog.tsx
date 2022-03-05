import React from 'react';
import clsx from 'clsx';
import Backdrop from '~/components/Backdrop';
import Card from '~/components/Card';

export interface DialogProps {
  open: boolean;
}

const Dialog: React.FunctionComponent<DialogProps> = ({ open, children }) => (
  <Backdrop
    className={clsx(
      !open && 'hidden',
      'flex items-center justify-center',
    )}
  >
    <Card className="">
      {children}
    </Card>
  </Backdrop>
);

export default Dialog;
