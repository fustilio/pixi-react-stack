import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Container, FederatedPointerEvent, type ColorSource } from "pixi.js";

import { Button } from "./Button";
import { IconButton } from "./extended/icon-button";
import { Triangle } from "lucide";

const MIN_THUMB_SIZE = 16;
// const TRACK_REPEAT_INTERVAL_MS = 200;

// Easing functions
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export type ScrollBarOrientation = "horizontal" | "vertical";
type ArrowDirection = "left" | "right" | "up" | "down";

function ArrowIcon({
  direction = "right",
  size = 12,
  color = 0xffffff,
}: {
  direction?: ArrowDirection;
  size?: number;
  color?: ColorSource;
}) {
  const rotation = useMemo(() => {
    switch (direction) {
      case "left":
        return Math.PI;
      case "up":
        return -Math.PI / 2;
      case "down":
        return Math.PI / 2;
      case "right":
      default:
        return 0;
    }
  }, [direction]);

  return (
    <pixiContainer
      rotation={rotation}
      width={size}
      height={size}
      x={size / 2}
      y={size / 2}
    >
      <pixiGraphics
        draw={(g) => {
          g.clear();
          const h = size * 0.5;
          // Triangle pointing right, centered at (0,0)
          g.moveTo(-h, -h * 0.8)
            .lineTo(-h, h * 0.8)
            .lineTo(h, 0)
            .closePath()
            .fill(color);
        }}
      />
    </pixiContainer>
  );
}

export interface ScrollBarProps {
  orientation?: ScrollBarOrientation;
  /** Total length of the scrollbar (including arrow buttons) */
  length?: number;
  /** Thickness (cross-axis size) */
  thickness?: number;
  /** Size of each arrow button along the main axis */
  buttonSize?: number;
  /** Length of the draggable thumb along the main axis */
  thumbSize?: number;
  /** Value between 0 and 1 representing thumb position along track */
  value?: number;
  /** Colors and visuals */
  trackColor?: ColorSource;
  trackAlpha?: number;
  thumbColor?: ColorSource;
  thumbRadius?: number;
  arrowColor?: ColorSource;
  /** Easing configuration */
  enableEasing?: boolean;
  easingDuration?: number; // ms
  easingFunction?: "easeOut" | "easeInOut";
  /** Called continuously while dragging or when value changes via track */
  onChange?: (value: number) => void;
  /** Called on drag end */
  onChangeEnd?: (value: number) => void;
  /** Called when user clicks the decrement (left/up) button */
  onDecrement?: () => void;
  /** Called when user clicks the increment (right/down) button */
  onIncrement?: () => void;
  /** Called when user clicks the track before the thumb */
  onPageDecrement?: () => void;
  /** Called when user clicks the track after the thumb */
  onPageIncrement?: () => void;
  /** Called when user clicks on track to jump to position (with easing) */
  onTrackJump?: (value: number) => void;
}

/**
 * Simple ScrollBar: visual + interactive buttons + draggable thumb.
 * Sizing and value range calculations are handled by the parent.
 * Behavior inspired by pixi-scrollbox's scrollbar interactions
 * (`pointerdown` on bar vs. thumb). See `scrollbox.js` for reference.
 */
export function ScrollBar({
  orientation = "horizontal",
  length = 200,
  thickness = 12,
  buttonSize,
  thumbSize = 40,
  value = 0,
  trackColor = 0x666666,
  trackAlpha = 0.3,
  thumbColor = 0x999999,
  thumbRadius = 6,
  enableEasing = true,
  easingDuration = 300,
  easingFunction = "easeOut",
  onChange,
  onChangeEnd,
  onDecrement,
  onIncrement,
  // onPageDecrement,
  // onPageIncrement,
  onTrackJump,
  arrowColor = 0xffffff,
}: ScrollBarProps) {
  const containerRef = useRef<Container>(null);
  const [dragging, setDragging] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const [dragOffset, setDragOffset] = useState(0); // Track click offset within thumb
  const [visualOffset, setVisualOffset] = useState(0); // Visual offset during drag (like MUI's transform)
  const [trackDragging, setTrackDragging] = useState(false); // Track if we're dragging from track click
  const lastTrackValueRef = useRef<number>(0); // Track last value to prevent vibration
  const thumbRef = useRef<Container>(null);

  const trackRepeatTimerRef = useRef<number | null>(null);
  const trackRepeatDirectionRef = useRef<"decrement" | "increment" | null>(
    null
  );

  // Easing animation state
  const animationRef = useRef<number | null>(null);
  const [animatedValue, setAnimatedValue] = useState(value);
  const animationStartRef = useRef<number>(0);
  const animationStartValueRef = useRef<number>(value);
  const animationTargetValueRef = useRef<number>(value);

  // Animation functions
  const getEasingFunction = useCallback(() => {
    return easingFunction === "easeInOut" ? easeInOutCubic : easeOutCubic;
  }, [easingFunction]);

  const startAnimation = useCallback(
    (targetValue: number) => {
      if (!enableEasing || dragging) {
        setAnimatedValue(targetValue);
        return;
      }

      // Cancel any existing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      animationStartRef.current = performance.now();
      animationStartValueRef.current = animatedValue;
      animationTargetValueRef.current = targetValue;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - animationStartRef.current;
        const progress = Math.min(elapsed / easingDuration, 1);

        if (progress >= 1) {
          setAnimatedValue(targetValue);
          animationRef.current = null;
          return;
        }

        const easingFn = getEasingFunction();
        const easedProgress = easingFn(progress);
        const currentValue =
          animationStartValueRef.current +
          (animationTargetValueRef.current - animationStartValueRef.current) *
            easedProgress;

        setAnimatedValue(currentValue);
        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    },
    [enableEasing, dragging, animatedValue, easingDuration, getEasingFunction]
  );

  // Keep internal value in sync with external (similar to MUI approach)
  useEffect(() => {
    // Always sync external changes - this is important for track clicks
    // that immediately update the external value
    if (Math.abs(value - internalValue) > 0.0001) {
      setInternalValue(value);
      if (enableEasing && !dragging) {
        startAnimation(value);
      } else {
        setAnimatedValue(value);
      }
    }
  }, [value, internalValue, enableEasing, dragging, startAnimation]);

  const isHorizontal = orientation === "horizontal";
  const mainLength = length;
  const cross = thickness;
  const arrow = buttonSize ?? cross;

  // Track dimensions (excluding buttons)
  const trackStart = arrow;
  const trackLength = Math.max(0, mainLength - arrow * 2);
  const effectiveThumbSize = Math.min(
    Math.max(thumbSize, MIN_THUMB_SIZE),
    trackLength
  );

  // Thumb position in pixels along the track (using animated value for smooth movement)
  const thumbPos = useMemo(() => {
    const travel = Math.max(0, trackLength - effectiveThumbSize);
    const valueToUse =
      enableEasing && !dragging ? animatedValue : internalValue;
    const basePos = trackStart + valueToUse * travel;
    // Add visual offset during dragging (like MUI's transform)
    return dragging ? basePos + visualOffset : basePos;
  }, [
    trackStart,
    trackLength,
    effectiveThumbSize,
    enableEasing,
    dragging,
    animatedValue,
    internalValue,
    visualOffset,
  ]);

  // Container dimensions
  const width = isHorizontal ? mainLength : cross;
  const height = isHorizontal ? cross : mainLength;

  // Convert a pointer to [0..1] value on the track, accounting for drag offset
  const pointerToValue = useCallback(
    (e: FederatedPointerEvent, offset = 0) => {
      if (!containerRef.current) return internalValue;
      const local = containerRef.current.worldTransform.applyInverse(e.global);
      if (!local) return internalValue;

      const pos = isHorizontal ? local.x : local.y;
      // Subtract the offset to account for where we clicked within the thumb
      const adjustedPos = pos - offset;
      const clamped = Math.max(
        trackStart,
        Math.min(adjustedPos, trackStart + trackLength - effectiveThumbSize)
      );
      const travel = Math.max(1e-6, trackLength - effectiveThumbSize);
      const next = (clamped - trackStart) / travel;
      return Math.max(0, Math.min(1, next));
    },
    [internalValue, isHorizontal, trackStart, trackLength, effectiveThumbSize]
  );

  // Drag handlers for thumb (following MUI interaction pattern)
  const handleThumbDown = useCallback(
    (e: FederatedPointerEvent) => {
      e.stopPropagation(); // Prevent track from handling this event

      if (!containerRef.current) return;
      const local = containerRef.current.worldTransform.applyInverse(e.global);
      if (!local) return;

      const pos = isHorizontal ? local.x : local.y;
      // Calculate offset from the start of the thumb using the current actual position
      // Use internalValue (not animated) for consistent offset calculation
      const currentThumbPos =
        trackStart +
        internalValue * Math.max(0, trackLength - effectiveThumbSize);
      const offset = pos - currentThumbPos;
      setDragOffset(offset);
      setVisualOffset(0); // Reset visual offset for new drag
      setDragging(true);

      // Don't change the value on initial click, just start dragging
      // The visual position will be updated via transform in handleThumbMove
    },
    [isHorizontal, trackStart, trackLength, effectiveThumbSize, internalValue]
  );

  const handleThumbUp = useCallback(() => {
    if (!dragging && !trackDragging) return;

    let finalValue = internalValue;
    let shouldCallOnChangeEnd = false;

    if (dragging) {
      // Calculate the final value based on the visual position
      finalValue =
        internalValue +
        visualOffset / Math.max(0, trackLength - effectiveThumbSize);
      finalValue = Math.max(0, Math.min(1, finalValue));

      setDragging(false);
      setVisualOffset(0); // Reset visual offset
      setInternalValue(finalValue);
      shouldCallOnChangeEnd = true;
    }

    if (trackDragging) {
      setTrackDragging(false);
      // For track dragging, we don't call onChangeEnd because onTrackJump was already called
      // This prevents double events when clicking on the track
      return;
    }

    // Call onChangeEnd only once with the final value (only for thumb dragging)
    if (shouldCallOnChangeEnd) {
      onChangeEnd?.(finalValue);
    }
  }, [
    dragging,
    trackDragging,
    internalValue,
    visualOffset,
    trackLength,
    effectiveThumbSize,
    onChangeEnd,
  ]);

  const handleThumbMove = useCallback(
    (e: FederatedPointerEvent) => {
      if (!dragging && !trackDragging) return;

      if (!containerRef.current) return;
      const local = containerRef.current.worldTransform.applyInverse(e.global);
      if (!local) return;

      const pos = isHorizontal ? local.x : local.y;

      if (dragging) {
        // Handle thumb dragging (original behavior)
        // Calculate the visual offset from the base position (like MUI's transform)
        const basePos =
          trackStart +
          internalValue * Math.max(0, trackLength - effectiveThumbSize);
        const newVisualOffset = pos - basePos - dragOffset;

        // Clamp the visual offset to stay within bounds
        const maxOffset = Math.max(0, trackLength - effectiveThumbSize);
        const clampedOffset = Math.max(
          -basePos + trackStart,
          Math.min(newVisualOffset, maxOffset - basePos + trackStart)
        );

        setVisualOffset(clampedOffset);

        // Calculate the actual value for onChange (but don't update internalValue yet)
        const v = pointerToValue(e, dragOffset);
        onChange?.(v);
      } else if (trackDragging) {
        // Handle track dragging (cursor following)
        // Only follow cursor if it's within the track area
        const withinTrack = isHorizontal
          ? pos >= trackStart && pos <= trackStart + trackLength
          : pos >= trackStart && pos <= trackStart + trackLength;

        if (withinTrack) {
          // Calculate the target value based on cursor position (center thumb on cursor)
          const targetPos = pos - effectiveThumbSize / 2;
          const clampedPos = Math.max(
            trackStart,
            Math.min(targetPos, trackStart + trackLength - effectiveThumbSize)
          );
          const travel = Math.max(1e-6, trackLength - effectiveThumbSize);
          const targetValue = (clampedPos - trackStart) / travel;
          const clampedValue = Math.max(0, Math.min(1, targetValue));

          // Debug logging to identify the issue
          console.log("Track drag debug:", {
            pos,
            targetPos,
            clampedPos,
            trackStart,
            trackLength,
            effectiveThumbSize,
            travel,
            targetValue,
            clampedValue,
            currentInternalValue: internalValue,
            direction:
              clampedValue > lastTrackValueRef.current ? "forward" : "backward",
          });

          // Prevent vibration by only updating if the change is significant enough
          const threshold = 0.005; // Minimum change required to update (0.5%)
          if (Math.abs(clampedValue - lastTrackValueRef.current) > threshold) {
            lastTrackValueRef.current = clampedValue;

            // Update position immediately during track drag
            if (onTrackJump) {
              onTrackJump(clampedValue);
            } else {
              onChange?.(clampedValue);
            }
          }
        }
        // If cursor moves outside track area, we simply don't update the position
        // The thumb stays at its last valid position
      }
    },
    [
      dragging,
      trackDragging,
      isHorizontal,
      trackStart,
      trackLength,
      effectiveThumbSize,
      internalValue,
      dragOffset,
      pointerToValue,
      onChange,
      onTrackJump,
    ]
  );

  // Track click - move thumb to cursor position, then start repeat if held
  const handleTrackDown = useCallback(
    (e: FederatedPointerEvent) => {
      if (!containerRef.current) return;
      const local = containerRef.current.worldTransform.applyInverse(e.global);
      if (!local) return;

      const pos = isHorizontal ? local.x : local.y;
      const thumbStart = thumbPos;
      const thumbEnd = thumbStart + effectiveThumbSize;
      const withinTrack = isHorizontal
        ? pos >= trackStart && pos <= trackStart + trackLength
        : pos >= trackStart && pos <= trackStart + trackLength;

      if (withinTrack) {
        // Only handle clicks that are NOT on the thumb
        if (pos < thumbStart || pos > thumbEnd) {
          // Calculate the target value based on cursor position
          // Center the thumb on the cursor position
          const targetPos = pos - effectiveThumbSize / 2;
          const clampedPos = Math.max(
            trackStart,
            Math.min(targetPos, trackStart + trackLength - effectiveThumbSize)
          );
          const travel = Math.max(1e-6, trackLength - effectiveThumbSize);
          const targetValue = (clampedPos - trackStart) / travel;
          const clampedValue = Math.max(0, Math.min(1, targetValue));

          // Start track dragging mode
          setTrackDragging(true);
          lastTrackValueRef.current = clampedValue; // Initialize last value

          // Move thumb to cursor position initially
          if (onTrackJump) {
            onTrackJump(clampedValue);
          } else {
            // Fallback to onChange if onTrackJump isn't provided (for standalone usage)
            onChange?.(clampedValue);
          }

          // Now the thumb will continuously follow the cursor in handleThumbMove
        }
      }
    },
    [
      isHorizontal,
      thumbPos,
      effectiveThumbSize,
      trackStart,
      trackLength,
      onTrackJump,
      onChange,
    ]
  );

  // Clear track repeat helpers
  const clearTrackRepeat = useCallback(() => {
    if (trackRepeatTimerRef.current != null) {
      window.clearInterval(trackRepeatTimerRef.current);
      trackRepeatTimerRef.current = null;
    }
    trackRepeatDirectionRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      // cleanup on unmount
      if (trackRepeatTimerRef.current != null) {
        window.clearInterval(trackRepeatTimerRef.current);
      }
      if (animationRef.current != null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <pixiContainer
      ref={containerRef}
      width={width}
      height={height}
      eventMode="static"
      onGlobalPointerMove={handleThumbMove}
      onPointerUp={() => {
        clearTrackRepeat();
        handleThumbUp();
      }}
      onPointerUpOutside={() => {
        clearTrackRepeat();
        handleThumbUp();
      }}
    >
      {/* Decrement button (left/up) */}
      <pixiContainer x={isHorizontal ? 0 : 0} y={isHorizontal ? 0 : 0}>
        <IconButton
          width={12}
          height={12}
          icon={Triangle}
          onPress={onDecrement}
          iconProps={{
            rotation: isHorizontal ? -(Math.PI / 2) : 0,
            size:12,
          }}
        />
      </pixiContainer>

      {/* Track */}
      <pixiContainer
        x={isHorizontal ? trackStart : 0}
        y={isHorizontal ? 0 : trackStart}
        eventMode="static"
        cursor="pointer"
        onPointerDown={handleTrackDown}
        onPointerUp={clearTrackRepeat}
        onPointerUpOutside={clearTrackRepeat}
      >
        <pixiGraphics
          draw={(g) => {
            g.clear();
            if (isHorizontal) {
              g.rect(0, 0, trackLength, cross).fill({
                color: trackColor,
                alpha: trackAlpha,
              });
            } else {
              g.rect(0, 0, cross, trackLength).fill({
                color: trackColor,
                alpha: trackAlpha,
              });
            }
          }}
        />
      </pixiContainer>

      {/* Thumb */}
      <pixiContainer
        ref={thumbRef}
        x={isHorizontal ? thumbPos : 0}
        y={isHorizontal ? 0 : thumbPos}
        eventMode="static"
        cursor="pointer"
        onPointerDown={handleThumbDown}
        onPointerUp={handleThumbUp}
        onPointerUpOutside={handleThumbUp}
      >
        <pixiGraphics
          draw={(g) => {
            g.clear();
            if (isHorizontal) {
              g.roundRect(0, 0, effectiveThumbSize, cross, thumbRadius).fill(
                thumbColor
              );
            } else {
              g.roundRect(0, 0, cross, effectiveThumbSize, thumbRadius).fill(
                thumbColor
              );
            }
          }}
        />
      </pixiContainer>

      {/* Increment button (right/down) */}
      <pixiContainer
        x={isHorizontal ? length - arrow : 0}
        y={isHorizontal ? 0 : length - arrow}
      >
        <IconButton
          width={12}
          height={12}
          icon={Triangle}
          onPress={onIncrement}
          iconProps={{
            rotation: isHorizontal ? Math.PI  / 2: 0,
            size: 12
          }}
        />
      </pixiContainer>
    </pixiContainer>
  );
}

export default ScrollBar;
