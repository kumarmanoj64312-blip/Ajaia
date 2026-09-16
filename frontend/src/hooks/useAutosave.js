import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Debounces calls to `saveFn` and exposes a status string for a
 * "Saving… / Saved / Error saving" indicator.
 */
export function useAutosave(saveFn, delay = 1000) {
  const [status, setStatus] = useState('idle'); // idle | saving | saved | error
  const timerRef = useRef(null);
  const latestArgs = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const trigger = useCallback(
    (...args) => {
      latestArgs.current = args;
      setStatus('saving');
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        try {
          await saveFn(...latestArgs.current);
          setStatus('saved');
        } catch (err) {
          setStatus('error');
        }
      }, delay);
    },
    [saveFn, delay]
  );

  const reset = useCallback(() => {
    clearTimeout(timerRef.current);
    setStatus('idle');
  }, []);

  return { status, trigger, reset };
}
