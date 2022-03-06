import React from 'react';
import clsx from 'clsx';
import { MdCheck, MdClose } from 'react-icons/md';
import Card from '~/components/Card';
import LinkButton from '~/components/LinkButton';

export interface ExamResultProps {
  score: number;
}

const ExamResult: React.FC<ExamResultProps> = ({ score }) => {
  const passed = score >= 68;

  const iconStyles = clsx(
    'text-8xl',
    passed && 'text-green-500',
    !passed && 'text-red-500',
  );

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <Card className="flex flex-col items-center">
        {passed ? <MdCheck className={iconStyles} /> : <MdClose className={iconStyles} />}
        <p className="text-3xl">{passed ? 'Wynik pozytywny' : 'Wynik negatywny'}</p>
        <p className="text-xl">{`Uzyskano ${score}/74 punktów`}</p>
        <LinkButton to="/app/exam" className="mt-8">Spróbuj ponownie</LinkButton>
      </Card>
    </div>
  );
};

export default ExamResult;
