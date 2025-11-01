import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../utils/sounds';

interface GoalProgressProps {
  current: number;
  limit: number;
}

const GoalProgress: React.FC<GoalProgressProps> = ({ current, limit }) => {
  const percentage = limit > 0 ? Math.round((current / limit) * 100) : 0;
  const isOverLimit = percentage > 100;

  const prevCurrent = useRef(current);
  const [isCelebrating, setIsCelebrating] = useState(false);

  useEffect(() => {
    // Trigger celebration when the goal is met or exceeded for the first time
    const justMetGoal = prevCurrent.current < limit && current >= limit;
    if (justMetGoal) {
      setIsCelebrating(true);
      playSound('goal');
      // Animation duration is 800ms, remove class after that
      const timer = setTimeout(() => setIsCelebrating(false), 800);
      return () => clearTimeout(timer);
    }
    prevCurrent.current = current;
  }, [current, limit]);


  let progressBarColor = 'bg-brand-primary'; // Green
  if (percentage >= 80 && percentage < 100) {
    progressBarColor = 'bg-yellow-500'; // Yellow
  } else if (percentage === 100) {
    progressBarColor = 'bg-orange-500'; // Orange for exactly 100%
  } else if (isOverLimit) {
    progressBarColor = 'bg-red-500'; // Red
  }

  return (
    <div className={`space-y-2 ${isCelebrating ? 'animate-goal-achieved-pulse' : ''}`}>
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Progress</span>
        <span className={`text-lg font-bold ${isOverLimit ? 'text-red-500' : 'text-text-primary dark:text-dark-text-primary'}`}>
          {current} / {limit}
        </span>
      </div>
      <div className="w-full bg-base-200 dark:bg-dark-bg-secondary rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${progressBarColor}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      <p className="text-right text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{percentage}%</p>
    </div>
  );
};

export default GoalProgress;
