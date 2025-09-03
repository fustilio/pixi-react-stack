import { useCallback, useMemo, useState, useEffect } from "react";
import { Container, FederatedPointerEvent } from "pixi.js";

import { ProgressBar } from "./ProgressBar";
import { type BaseSliderOptions } from "./SliderBase";

export type SliderOptions = BaseSliderOptions & {
  slider?: string | Container | (() => React.ReactNode);
  value?: number;
  step?: number;
  onChange?: (value: number) => void;
  onUpdate?: (value: number) => void;
};

/**
 * Single value slider component built on top of SliderBase.
 * This follows the pixi-react guide patterns for optimal performance.
 */
export function Slider(options: SliderOptions) {
  const {
    min = 0,
    max = 100,
    step = 1,
    showValue = false,
    valueTextOffset = { x: 0, y: 0 },
    slider,
    value = 0,
    onChange,
    onUpdate,
    ...progressBarOptions
  } = options;

  // State for slider value
  const [sliderValue, setSliderValue] = useState(value);
  const [dragging, setDragging] = useState(false);

  // Sync internal state with external value changes
  useEffect(() => {
    // Only update if the value actually changed to prevent unnecessary re-renders
    if (Math.abs(value - sliderValue) > 0.001) {
      setSliderValue(value);
    }
  }, [value, sliderValue]);

  // Validate and clamp values
  const validateValue = useCallback(
    (value: number): number => {
      let val = Math.round(value / step) * step; // Snap to step
      if (val < min) val = min;
      if (val > max) val = max;
      return val;
    },
    [min, max, step],
  );

  // Update value and call callbacks
  const updateValue = useCallback(
    (newValue: number) => {
      const validatedValue = validateValue(newValue);
      if (Math.abs(validatedValue - sliderValue) > 0.001) {
        setSliderValue(validatedValue);
        onChange?.(validatedValue);
        onUpdate?.(validatedValue);
      }
    },
    [sliderValue, validateValue, onChange, onUpdate],
  );

  // Handle drag start
  const handleDragStart = useCallback((event: FederatedPointerEvent) => {
    setDragging(true);
    // Immediately seek to the clicked position
    const obj = event.currentTarget as Container;
    const parent = obj.parent;
    
    if (!parent) return;
    
    // Get the local coordinates relative to the parent container
    const localPoint = parent.worldTransform.applyInverse(event.global);
    const x = localPoint.x;
    
    // Clamp x to the progress bar bounds
    const bgWidth = progressBarOptions.width || 200;
    const clampedX = Math.max(0, Math.min(x, bgWidth));
    
    // Calculate new value based on position
    const positionRatio = clampedX / bgWidth;
    const rawValue = min + positionRatio * (max - min);
    const newValue = validateValue(rawValue);

    console.log('🎯 Slider drag start:', { 
      x, 
      clampedX, 
      positionRatio, 
      rawValue, 
      newValue 
    });

    updateValue(newValue);
  }, [min, max, validateValue, updateValue, progressBarOptions.width]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDragging(false);
  }, []);

  // Handle drag move
  const handleDragMove = useCallback(
    (event: FederatedPointerEvent) => {
      if (!dragging) return;

      const obj = event.currentTarget as Container;
      const parent = obj.parent;
      
      if (!parent) return;
      
      // Get the local coordinates relative to the parent container
      const localPoint = parent.worldTransform.applyInverse(event.global);
      const x = localPoint.x;
      
      // Clamp x to the progress bar bounds
      const bgWidth = progressBarOptions.width || 200;
      const clampedX = Math.max(0, Math.min(x, bgWidth));
      
      // Calculate new value based on position
      const positionRatio = clampedX / bgWidth;
      const rawValue = min + positionRatio * (max - min);
      const newValue = validateValue(rawValue);

      console.log('🎯 Slider dragging:', { 
        x, 
        clampedX, 
        positionRatio, 
        rawValue, 
        newValue, 
        dragging 
      });

      updateValue(newValue);
    },
    [dragging, min, max, validateValue, updateValue, progressBarOptions.width],
  );

  // Calculate progress for progress bar
  const progress = useMemo(() => {
    return ((sliderValue - min) / (max - min)) * 100;
  }, [sliderValue, min, max]);

  // Calculate slider position
  const sliderPosition = useMemo(() => {
    const bgWidth = progressBarOptions.width || 200;
    return (bgWidth / 100) * progress;
  }, [progress, progressBarOptions.width]);

  // Render custom slider handle
  const renderSliderHandle = useMemo(() => {
    if (typeof slider === "function") {
      // Function-based slider handle
      return slider();
    } else if (typeof slider === "string") {
      // String-based slider (placeholder for now)
      return (
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.beginFill(0xffffff);
            g.drawCircle(0, 0, 10);
            g.endFill();
          }}
        />
      );
    } else {
      // Container-based slider (placeholder for now)
      return (
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.beginFill(0xffffff);
            g.drawCircle(0, 0, 10);
            g.endFill();
          }}
        />
      );
    }
  }, [slider]);

  return (
    <pixiContainer
      width={progressBarOptions.width || 200}
      height={progressBarOptions.height || 20}
    >
      {/* Progress bar background - make it draggable */}
      <pixiContainer
        eventMode="static"
        cursor="pointer"
        onPointerDown={handleDragStart}
        onPointerUp={handleDragEnd}
        onPointerUpOutside={handleDragEnd}
        onGlobalPointerMove={handleDragMove}
      >
        <ProgressBar
          {...progressBarOptions}
          progress={progress}
          width={progressBarOptions.width || 200}
          height={progressBarOptions.height || 20}
        />
      </pixiContainer>

      {/* Slider handle */}
      <pixiContainer
        x={sliderPosition}
        y={(progressBarOptions.height || 20) / 2}
        eventMode="static"
        cursor="pointer"
        onPointerDown={handleDragStart}
        onPointerUp={handleDragEnd}
        onPointerUpOutside={handleDragEnd}
        onGlobalPointerMove={handleDragMove}
      >
        {renderSliderHandle}
      </pixiContainer>

      {/* Value text display */}
      {showValue && (
        <pixiText
          text={`${Math.round(sliderValue)}`}
          x={sliderPosition + (valueTextOffset.x || 0)}
          y={(progressBarOptions.height || 20) / 2 + (valueTextOffset.y || 0)}
          anchor={0.5}
          style={{ fill: 0xffffff, fontSize: 14 }}
        />
      )}
    </pixiContainer>
  );
}
