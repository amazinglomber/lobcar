import React from 'react';
import Backdrop from '~/components/Backdrop';
import Card from '~/components/Card';
import clsx from 'clsx';

export interface DialogProps {
  open: boolean;
}

const Dialog: React.FunctionComponent<DialogProps> = ({ open, children }) => {
  return (
    <Backdrop
      className={clsx(
        !open && 'hidden',
        'flex items-center justify-center'
      )}
    >
      <Card className="">
        {children}
      </Card>
    </Backdrop>
  );
};

export default Dialog;
