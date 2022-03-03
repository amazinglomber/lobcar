import { MdCheck, MdClose } from 'react-icons/md';
import clsx from 'clsx';
import React from 'react';

export interface AnswerProps {
  label: string;
  isCorrect: boolean;
  checkedAnswer: boolean;
  checked: boolean;
  onClick: () => void;
}

const Answer = ({ label, isCorrect, checkedAnswer, checked, onClick }: AnswerProps) => {
  return (
    <div
      className={clsx(
        'p-4 mt-4 flex flex-row items-center border-2 cursor-pointer rounded-xl transition ease-linear group',
        checked && 'border-primary',
        !checked && 'border-gray-500 hover:opacity-80',
        checkedAnswer && isCorrect && 'border-green-500',
        checkedAnswer && !isCorrect && 'border-red-500',
      )}
      onClick={onClick}
    >
      <div
        className="flex items-center justify-center border-2 border-gray-500 rounded-lg group-hover:border-gray-400 transition ease-linear"
      >
        {!checkedAnswer ? (
          <MdCheck
            className={clsx(
              'text-primary transition text-2xl',
              checked && 'opacity-1',
              !checked && 'opacity-0',
            )}
          />
        ) : isCorrect ? (
          <MdCheck className={'text-green-500 transition text-2xl'} />
        ) : (
          <MdClose className={'text-red-500 transition text-2xl'} />
        )}
      </div>
      <h2 className="ml-3 text-lg">{label}</h2>
    </div>
  );
};

export default React.memo(Answer);
