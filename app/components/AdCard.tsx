import React from 'react';
import Card from '~/components/Card';
import { SiBuymeacoffee } from 'react-icons/si';
import clsx from 'clsx';

export interface AdCardProps {
  className?: string;
}

const AdCard: React.FC<AdCardProps> = ({ className }) => {
  return (
    <Card className={clsx('flex flex-col items-center', className)}>
      <SiBuymeacoffee className="text-8xl mb-4" />

      <h4 className="text-2xl text-center">
        Jeśli podoba ci się ta aplikacja i chcesz mnie wesprzeć, możesz
        <a className="text-primary" href="https://buymeacoffee.com/lomber" target="_blank"> kupić mi kawę</a>
      </h4>
    </Card>
  );
};

export default AdCard;
