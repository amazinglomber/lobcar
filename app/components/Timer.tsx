import React, { useEffect, useState } from 'react';

export interface TimerProps {
  startSeconds: number;
}

const Timer: React.FunctionComponent<TimerProps> = ({ startSeconds }) => {
  const [timer, setTimer] = useState(startSeconds);
  const [timerToggle, setTimerToggle] = useState(true);

  useEffect(() => {
    let _timer: NodeJS.Timeout;

    if (timerToggle) {
      _timer = setInterval(() => {
        setTimer((time) => time - 1);
      }, 1000);
    }

    return () => {
      clearInterval(_timer);
    };
  }, [timerToggle]);

  return (
    <div>
      {timer}
    </div>
  );
};

export default Timer;
