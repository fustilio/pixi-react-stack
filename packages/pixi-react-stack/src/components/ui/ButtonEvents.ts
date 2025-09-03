import { useCallback, useState } from "react";
import { FederatedPointerEvent } from "pixi.js";

/** Events controller used for {@link Button}. */
export interface ButtonEventsProps {
  /** Event that is fired when the button is down. */
  onDown?: (e?: FederatedPointerEvent) => void;
  /**
   * Event that fired when a down event happened inside the button
   * and up event happened inside or outside of the button
   */
  onUp?: (e?: FederatedPointerEvent) => void;
  /**
   * Event that fired when mouse up event happens outside of the button
   * after the down event happened inside the button boundaries.
   */
  onUpOut?: (e?: FederatedPointerEvent) => void;
  /** Event that fired when the mouse is out of the view */
  onOut?: (e?: FederatedPointerEvent) => void;
  /** Event that is fired when the button is pressed. */
  onPress?: (e?: FederatedPointerEvent) => void;
  /** Event that is fired when the mouse hovers the button. Fired only if device is not mobile.*/
  onHover?: (e?: FederatedPointerEvent) => void;
}

/**
 * Hook that provides button event handling logic.
 * This follows the pixi-react guide patterns for optimal performance.
 */
export function useButtonEvents(props: ButtonEventsProps) {
  const { onDown, onUp, onUpOut, onOut, onPress, onHover } = props;
  const [isMouseIn, setIsMouseIn] = useState(false);
  const [isDown, setIsDown] = useState(false);

  const processDown = useCallback(
    (e: FederatedPointerEvent) => {
      setIsDown(true);
      onDown?.(e);
    },
    [onDown],
  );

  const processUp = useCallback(
    (e?: FederatedPointerEvent) => {
      if (isDown) {
        onUp?.(e);
      }
      setIsDown(false);
    },
    [isDown, onUp],
  );

  const processUpOut = useCallback(
    (e?: FederatedPointerEvent) => {
      if (isDown) {
        onUp?.(e);
        onUpOut?.(e);
      }
      setIsDown(false);
    },
    [isDown, onUp, onUpOut],
  );

  const processOut = useCallback(
    (e?: FederatedPointerEvent) => {
      if (isMouseIn) {
        setIsMouseIn(false);
        onOut?.(e);
      }
    },
    [isMouseIn, onOut],
  );

  const processPress = useCallback(
    (e: FederatedPointerEvent) => {
      setIsDown(false);
      onPress?.(e);
    },
    [onPress],
  );

  const processOver = useCallback(
    (e: FederatedPointerEvent) => {
      // Check if mobile - for now we'll assume non-mobile
      // In a real implementation, you might want to detect this
      setIsMouseIn(true);
      onHover?.(e);
    },
    [onHover],
  );

  return {
    isDown,
    isMouseIn,
    processDown,
    processUp,
    processUpOut,
    processOut,
    processPress,
    processOver,
  };
}
