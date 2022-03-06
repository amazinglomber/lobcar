import React from 'react';
import clsx from 'clsx';

export interface ProgressBarProps {
  value: number;
  max: number;
  valueSuffix?: string;
  progressBarStyles?: string;
  progressValueStyles?: string;
}

const ProgressBar: React.FunctionComponent<ProgressBarProps> = ({
  max, value, progressBarStyles, progressValueStyles, valueSuffix,
}) => (
  <div className={clsx(
    'w-full bg-gray-500 h-6 text-center',
    progressBarStyles,
  )}
  >
    <div
      className={clsx(
        'bg-primary h-full transition-width text-right',
        progressValueStyles,
      )}
      style={{ width: `${(value / max) * 100}%` }}
    >
      <span className="relative right-0 top-0 bottom-0 min-w-fit px-2 text-white whitespace-nowrap">
        {`${value} ${valueSuffix ?? ''}`}
      </span>
    </div>
  </div>
);

export default ProgressBar;
