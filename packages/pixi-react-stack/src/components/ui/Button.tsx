import { useCallback, useState, type ReactNode } from "react";
import { FederatedPointerEvent, Graphics } from "pixi.js";

import { useButtonEvents, type ButtonEventsProps } from "./ButtonEvents";

export interface ButtonProps extends ButtonEventsProps {
  /** The content to render inside the button */
  children?: ReactNode;
  /** Whether the button is disabled and cannot receive events */
  disabled?: boolean;
  /** Custom styling for the button */
  style?: {
    backgroundColor?: number;
    borderColor?: number;
    borderWidth?: number;
    borderRadius?: number;
    width?: number;
    height?: number;
  };
}

/**
 * Button component that provides interactive button functionality.
 * This follows the pixi-react guide patterns for optimal performance.
 *
 * @example
 * <Button
 *   onPress={() => console.log('Button clicked!')}
 *   style={{ backgroundColor: 0x4CAF50, width: 100, height: 40 }}
 * >
 *   <pixiText text="Click Me" style={{ fill: 0xffffff }} />
 * </Button>
 */
export function Button({
  children,
  disabled = false,
  style = {},
  ...eventProps
}: ButtonProps) {
  const [isDown, setIsDown] = useState(false);

  const {
    processDown,
    processUp,
    processUpOut,
    processOut,
    processPress,
    processOver,
  } = useButtonEvents(eventProps);

  const handlePointerDown = useCallback(
    (e: FederatedPointerEvent) => {
      if (disabled) return;
      setIsDown(true);
      processDown(e);
    },
    [disabled, processDown],
  );

  const handlePointerUp = useCallback(
    (e: FederatedPointerEvent) => {
      if (disabled) return;

      // If the button was pressed down and now released, trigger press event
      if (isDown) {
        processPress(e);
      }

      setIsDown(false);
      processUp(e);
    },
    [disabled, processUp, processPress, isDown],
  );

  const handlePointerUpOutside = useCallback(
    (e: FederatedPointerEvent) => {
      if (disabled) return;
      setIsDown(false);
      processUpOut(e);
    },
    [disabled, processUpOut],
  );

  const handlePointerOut = useCallback(
    (e: FederatedPointerEvent) => {
      if (disabled) return;
      setIsDown(false);
      processOut(e);
    },
    [disabled, processOut],
  );

  const handlePointerOver = useCallback(
    (e: FederatedPointerEvent) => {
      if (disabled) return;
      processOver(e);
    },
    [disabled, processOver],
  );

  const drawButton = useCallback(
    (g: Graphics) => {
      g.clear();

      const {
        backgroundColor = 0x4caf50,
        borderColor = 0x2e7d32,
        borderWidth = 2,
        borderRadius = 8,
        width = 100,
        height = 40,
      } = style;

      // Draw border
      if (borderWidth > 0) {
        g.setStrokeStyle({
          width: borderWidth,
          color: borderColor,
          alpha: 1,
        });
      }

      // Draw background with pressed state
      const bgColor = isDown ? 0x388e3c : backgroundColor;

      if (borderRadius > 0) {
        g.roundRect(0, 0, width, height, borderRadius).fill(bgColor).stroke();
      } else {
        g.rect(0, 0, width, height).fill(bgColor).stroke();
      }
    },
    [style, isDown],
  );

  return (
    <pixiContainer
      eventMode={disabled ? "none" : "static"}
      cursor={disabled ? "default" : "pointer"}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerUpOutside={handlePointerUpOutside}
      onPointerOut={handlePointerOut}
      onPointerOver={handlePointerOver}
    >
      {/* Button background */}
      <pixiGraphics draw={drawButton} />

      {/* Button content */}
      <pixiContainer
        // need to add padding
        width={style.width || 100}
        height={style.height || 40}
      >
        {children}
      </pixiContainer>
    </pixiContainer>
  );
}

/**
 * Button based on container. You can use it same as {@link Button}
 * but without need to pre create a container and interact with it through `.view` accessor.
 *
 * @example
 * <ButtonContainer
 *   onPress={() => console.log('Button clicked!')}
 *   style={{ backgroundColor: 0x4CAF50, width: 100, height: 40 }}
 * >
 *   <pixiText text="Click Me" style={{ fill: 0xffffff }} />
 * </ButtonContainer>
 */
export function ButtonContainer({
  children,
  disabled = false,
  style = {},
  ...eventProps
}: ButtonProps) {
  return (
    <Button disabled={disabled} style={style} {...eventProps}>
      {children}
    </Button>
  );
}
