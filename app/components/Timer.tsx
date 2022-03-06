import React, { useEffect, useState } from 'react';
import useInterval from '~/hooks/useInterval';

/**
 * Returns seconds formatted as mm:ss
 * @param seconds Time in seconds to format.
 */
function formatSecondsAsTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return `${m < 10 ? 0 : ''}${m}:${s < 10 ? 0 : ''}${s}`;
}

export interface TimerProps {
  start: number;
  end?: number;
  onEnd?: () => void;
  paused?: boolean;
}

const Timer: React.FC<TimerProps> = ({
  start, end = 0, onEnd, paused = false,
}) => {
  const [seconds, setSeconds] = useState(start);
  const [timerRunning, setTimerRunning] = useState(true);

  useInterval(() => {
    setSeconds((currentSeconds) => currentSeconds - 1);
  }, timerRunning && !paused ? 1000 : null);

  useEffect(() => {
    if (seconds <= end) {
      setTimerRunning(false);

      if (onEnd) {
        onEnd();
      }
    }
  }, [seconds]);

  return (
    <div>
      {formatSecondsAsTimer(seconds)}
    </div>
  );
};

export default Timer;
