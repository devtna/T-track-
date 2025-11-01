import { useState, useCallback, useEffect } from 'react';

const SUBSCRIPTION_KEY = 'tobaccoTrackProStatus';

export const useSubscription = () => {
  const [isPro, setIsPro] = useState<boolean>(() => {
    try {
      const item = window.localStorage.getItem(SUBSCRIPTION_KEY);
      return item ? JSON.parse(item) === true : false;
    } catch (error) {
      console.error('Error reading subscription status from localStorage', error);
      return false;
    }
  });
  
  // This effect ensures that if the status is changed in another tab,
  // this tab's state will update to match.
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === SUBSCRIPTION_KEY) {
        setIsPro(event.newValue ? JSON.parse(event.newValue) === true : false);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const setSubscriptionStatus = useCallback((status: boolean) => {
    try {
      window.localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(status));
      setIsPro(status);
    } catch (error) {
      console.error('Error saving subscription status to localStorage', error);
    }
  }, []);

  const subscribe = useCallback(() => {
    setSubscriptionStatus(true);
  }, [setSubscriptionStatus]);

  const unsubscribe = useCallback(() => {
    setSubscriptionStatus(false);
  }, [setSubscriptionStatus]);

  return { isPro, subscribe, unsubscribe };
};