import { useState, useEffect, useCallback } from 'react';
import type { SmokeLog } from '../types';
import { db } from '../db';

export const useTobaccoData = () => {
  const [logs, setLogs] = useState<SmokeLog[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const allLogs = await db.logs.orderBy('timestamp').reverse().toArray();
        setLogs(allLogs);
      } catch (error) {
        console.error("Failed to load logs from database", error);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchLogs();
  }, []);

  const addLog = useCallback(async () => {
    try {
      const timestamp = Date.now();
      // Dexie's `add` method returns the auto-incremented ID.
      const id = await db.logs.add({ timestamp });
      // Optimistically update the local state for a responsive UI.
      setLogs(prevLogs => [{ id, timestamp }, ...prevLogs]);
    } catch (error) {
      console.error("Failed to add log to database", error);
    }
  }, []);

  const deleteLog = useCallback(async (id: number) => {
    try {
      await db.logs.delete(id);
      setLogs(prevLogs => prevLogs.filter(log => log.id !== id));
    } catch (error) {
      console.error("Failed to delete log from database", error);
    }
  }, []);
  
  const clearAllLogs = useCallback(async () => {
    try {
        await db.logs.clear();
        setLogs([]);
    } catch (error) {
        console.error("Failed to clear logs from database", error);
    }
  }, []);

  return { logs, addLog, deleteLog, clearAllLogs, isLoaded };
};
