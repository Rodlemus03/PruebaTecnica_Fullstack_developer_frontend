import { useCallback, useEffect, useEffectEvent, useState } from 'react';

export function useRequest(request, key = '') {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ requestKey: null, data: null, error: null });
  const requestKey = `${key}#${attempt}`;
  const runRequest = useEffectEvent((signal) => request(signal));

  useEffect(() => {
    const controller = new AbortController();

    runRequest(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setResult({ requestKey, data, error: null });
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setResult((current) => ({ requestKey, data: current.data, error }));
        }
      });

    return () => controller.abort();
  }, [requestKey]);

  const reload = useCallback(() => setAttempt((value) => value + 1), []);

  return {
    data: result.data,
    error: result.requestKey === requestKey ? result.error : null,
    loading: result.requestKey !== requestKey,
    reload,
  };
}
