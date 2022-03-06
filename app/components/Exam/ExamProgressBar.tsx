import React from 'react';
import clsx from 'clsx';
import ProgressBar, { ProgressBarProps } from '~/components/ProgressBar';

interface ExamProgressBarProps extends ProgressBarProps {}

const ExamProgressBar: React.FC<ExamProgressBarProps> = ({ value, ...other }) => (
  <ProgressBar
    value={value}
    valueSuffix="s"
    progressValueStyles={clsx(
      (value <= 8 && value > 5) && 'bg-yellow-500',
      value <= 5 && 'bg-red-500',
    )}
    {...other}
  />
);

export default ExamProgressBar;
