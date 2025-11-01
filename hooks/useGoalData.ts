import { useState, useEffect, useCallback } from 'react';
import type { Goal, GoalType } from '../types';
import { db } from '../db';

const defaultGoals: Record<GoalType, Goal> = {
  daily: { type: 'daily', limit: 0 },
  weekly: { type: 'weekly', limit: 0 },
  monthly: { type: 'monthly', limit: 0 },
};

export const useGoalData = () => {
  const [goals, setGoals] = useState<Record<GoalType, Goal>>(defaultGoals);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const storedGoals = await db.goals.toArray();
        if (storedGoals.length > 0) {
          const goalsMap = storedGoals.reduce((acc, goal) => {
            acc[goal.type] = goal;
            return acc;
          }, {} as Record<GoalType, Goal>);
          setGoals({ ...defaultGoals, ...goalsMap });
        } else {
          // First time setup, populate DB with defaults
          await db.goals.bulkAdd(Object.values(defaultGoals));
          setGoals(defaultGoals);
        }
      } catch (error) {
        console.error("Failed to load goals from database", error);
        setGoals(defaultGoals);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchGoals();
  }, []);


  const setGoal = useCallback(async (goal: Goal) => {
    try {
      // `put` will insert or update the goal based on its primary key (`type`).
      await db.goals.put(goal);
      setGoals(prevGoals => ({
        ...prevGoals,
        [goal.type]: goal,
      }));
    } catch (error) {
      console.error("Failed to save goal to database", error);
    }
  }, []);

  return { goals, setGoal, isLoaded };
};
