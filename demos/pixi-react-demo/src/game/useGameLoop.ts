import { useEffect, useRef } from "react";
import { useTick } from "@pixi/react";

export function useGameLoop(callback: (delta: number) => void) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useTick((ticker) => {
    callbackRef.current(ticker.deltaMS / 1000);
  });
}
