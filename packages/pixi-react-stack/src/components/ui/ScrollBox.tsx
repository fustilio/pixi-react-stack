import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Viewport as PixiViewport } from "pixi-viewport";

import { ScrollBar } from "./ScrollBar";
import { Viewport } from "./Viewport";

// Easing functions for viewport animations
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export interface ScrollBoxAPI {
  scrollToLeft: (left: number, immediate?: boolean) => void;
  scrollToValue: (value: number, immediate?: boolean) => void;
  moveViewportDirect: (left: number) => void; // Direct movement for follow mode
}

export interface ScrollBoxProps {
  width?: number;
  height?: number;
  children?: React.ReactNode;

  worldWidth?: number;
  worldHeight?: number;
  smallStepPx?: number;
  pageStepPx?: number;
  onScrollStart?: (value: number) => void;
  onScrollEnd?: (value: number) => void;
  onViewportRef?: (viewport: PixiViewport | null) => void;
  onScrollBoxRef?: (api: ScrollBoxAPI | null) => void;

  // Easing configuration
  enableEasing?: boolean;
  easingDuration?: number;
  easingFunction?: "easeOut" | "easeInOut";
}

/**
 * Thin wrapper around Viewport + ScrollBar with linked configuration.
 * Accepts any children and provides scrollbar controls.
 */
export function ScrollBox({
  width = 100,
  height = 100,
  children,
  worldWidth,
  worldHeight,
  smallStepPx,
  pageStepPx,
  onScrollStart,
  onScrollEnd,
  onViewportRef,
  onScrollBoxRef,
  enableEasing = true,
  easingDuration = 300,
  easingFunction = "easeOut",
}: ScrollBoxProps) {
  const ref = useRef<PixiViewport>(null);
  const [scrollValue, setScrollValue] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // Viewport easing animation state
  const viewportAnimationRef = useRef<number | null>(null);
  const viewportAnimationStartRef = useRef<number>(0);
  const viewportAnimationStartLeftRef = useRef<number>(0);
  const viewportAnimationTargetLeftRef = useRef<number>(0);

  const barThickness = 16;
  const barButtonSize = 16;
  const effectiveWorldWidth = worldWidth ?? width;
  const isBarHidden = effectiveWorldWidth <= width;
  const viewportHeight = Math.max(0, height - (isBarHidden ? 0 : barThickness));

  const maxLeft = Math.max(0, effectiveWorldWidth - width);

  // Debounced scroll end scheduling
  const SCROLL_END_TIMEOUT = 150;
  const scrollEndTimerRef = useRef<number | null>(null);

  // Viewport easing functions
  const getViewportEasingFunction = useCallback(() => {
    return easingFunction === "easeInOut" ? easeInOutCubic : easeOutCubic;
  }, [easingFunction]);

  const animateViewportToLeft = useCallback(
    (targetLeft: number, immediate = false) => {
      const viewport = ref.current;
      if (!viewport) return;

      if (!enableEasing || immediate) {
        viewport.moveCorner(targetLeft, viewport.top ?? 0);
        return;
      }

      // Cancel any existing animation
      if (viewportAnimationRef.current) {
        cancelAnimationFrame(viewportAnimationRef.current);
      }

      const currentLeft = viewport.left ?? 0;
      viewportAnimationStartRef.current = performance.now();
      viewportAnimationStartLeftRef.current = currentLeft;
      viewportAnimationTargetLeftRef.current = targetLeft;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - viewportAnimationStartRef.current;
        const progress = Math.min(elapsed / easingDuration, 1);

        if (progress >= 1) {
          viewport.moveCorner(targetLeft, viewport.top ?? 0);
          viewportAnimationRef.current = null;
          return;
        }

        const easingFn = getViewportEasingFunction();
        const easedProgress = easingFn(progress);
        const currentLeft =
          viewportAnimationStartLeftRef.current +
          (viewportAnimationTargetLeftRef.current -
            viewportAnimationStartLeftRef.current) *
            easedProgress;

        viewport.moveCorner(currentLeft, viewport.top ?? 0);
        viewportAnimationRef.current = requestAnimationFrame(animate);
      };

      viewportAnimationRef.current = requestAnimationFrame(animate);
    },
    [enableEasing, easingDuration, getViewportEasingFunction]
  );
  const scheduleScrollEnd = useCallback(
    (v: number) => {
      if (scrollEndTimerRef.current != null) {
        window.clearTimeout(scrollEndTimerRef.current);
      }
      const id = window.setTimeout(() => {
        setIsScrolling(false);
        onScrollEnd?.(v);
        scrollEndTimerRef.current = null;
      }, SCROLL_END_TIMEOUT);
      scrollEndTimerRef.current = id as unknown as number;
    },
    [onScrollEnd]
  );

  const leftToValue = useCallback(
    (left: number) =>
      maxLeft <= 0 ? 0 : Math.max(0, Math.min(1, left / maxLeft)),
    [maxLeft]
  );

  const valueToLeft = useCallback(
    (value: number) =>
      maxLeft <= 0 ? 0 : Math.max(0, Math.min(maxLeft, value * maxLeft)),
    [maxLeft]
  );

  const updateFromViewport = useCallback(() => {
    const viewport = ref.current;
    if (!viewport) return;
    // Skip updates during our own viewport animations to prevent loops
    if (viewportAnimationRef.current) return;

    // viewport.left is the world x of the visible left edge when scale = 1
    const next = leftToValue(viewport.left ?? 0);
    setScrollValue((prev) => (Math.abs(prev - next) > 0.0001 ? next : prev));
    // emit start/end around viewport-driven moves
    if (!isScrolling) {
      setIsScrolling(true);
      onScrollStart?.(next);
    }
    // debounce end
    scheduleScrollEnd(next);
  }, [leftToValue, isScrolling, onScrollStart, scheduleScrollEnd]);

  const moveViewportToValue = useCallback(
    (value: number, immediate = false) => {
      const nextLeft = valueToLeft(value);
      animateViewportToLeft(nextLeft, immediate);
      setScrollValue(value);
    },
    [valueToLeft, animateViewportToLeft]
  );

  const stepBy = useCallback(
    (deltaPx: number) => {
      const viewport = ref.current;
      if (!viewport) return;
      const currentLeft = viewport.left ?? 0;
      const nextLeft = Math.max(0, Math.min(maxLeft, currentLeft + deltaPx));
      animateViewportToLeft(nextLeft);
      const nextValue = leftToValue(nextLeft);
      setScrollValue(nextValue);
      if (!isScrolling) {
        setIsScrolling(true);
        onScrollStart?.(nextValue);
      }
      scheduleScrollEnd(nextValue);
    },
    [
      leftToValue,
      maxLeft,
      isScrolling,
      onScrollStart,
      scheduleScrollEnd,
      animateViewportToLeft,
    ]
  );

  // External API for smooth scrolling
  const scrollToLeft = useCallback(
    (left: number, immediate = false) => {
      const clampedLeft = Math.max(0, Math.min(maxLeft, left));
      animateViewportToLeft(clampedLeft, immediate);
      const value = leftToValue(clampedLeft);
      setScrollValue(value);

      if (!isScrolling) {
        setIsScrolling(true);
        onScrollStart?.(value);
      }
      scheduleScrollEnd(value);
    },
    [
      maxLeft,
      animateViewportToLeft,
      leftToValue,
      isScrolling,
      onScrollStart,
      scheduleScrollEnd,
    ]
  );

  const scrollToValue = useCallback(
    (value: number, immediate = false) => {
      moveViewportToValue(value, immediate);
    },
    [moveViewportToValue]
  );

  // Direct viewport movement for follow mode - bypasses easing but updates scroll state
  const moveViewportDirect = useCallback(
    (left: number) => {
      const viewport = ref.current;
      if (!viewport) return;

      const clampedLeft = Math.max(0, Math.min(maxLeft, left));

      // Prevent moving to 0 if we're already scrolled and this would reset the scroll
      if (clampedLeft === 0 && scrollValue > 0.01 && left === 0) {
        console.log("⚠️ Preventing moveViewportDirect reset to 0", {
          clampedLeft,
          scrollValue,
          left,
          maxLeft,
        });
        return;
      }

      // Move viewport directly without animation
      viewport.moveCorner(clampedLeft, viewport.top ?? 0);

      // Update scroll value to keep scroll bar in sync
      const value = leftToValue(clampedLeft);
      setScrollValue(value);
    },
    [maxLeft, leftToValue, scrollValue]
  );

  // Use refs to store stable API functions to prevent recreation
  const scrollToLeftRef = useRef(scrollToLeft);
  const scrollToValueRef = useRef(scrollToValue);
  const moveViewportDirectRef = useRef(moveViewportDirect);

  // Update refs when functions change
  scrollToLeftRef.current = scrollToLeft;
  scrollToValueRef.current = scrollToValue;
  moveViewportDirectRef.current = moveViewportDirect;

  const scrollBoxAPI: ScrollBoxAPI = useMemo(
    () => ({
      scrollToLeft: (left: number, immediate?: boolean) =>
        scrollToLeftRef.current(left, immediate),
      scrollToValue: (value: number, immediate?: boolean) =>
        scrollToValueRef.current(value, immediate),
      moveViewportDirect: (left: number) => moveViewportDirectRef.current(left),
    }),
    []
  ); // Empty dependency array since we use refs

  // Thumb size proportional to visible fraction
  const thumbSize = useMemo(() => {
    const visibleFraction =
      effectiveWorldWidth <= 0 ? 1 : Math.min(1, width / effectiveWorldWidth);
    return Math.max(20, Math.floor(width * visibleFraction));
  }, [effectiveWorldWidth, width]);

  const handleChange = useCallback(
    (v: number) => {
      if (!isScrolling) {
        setIsScrolling(true);
        onScrollStart?.(v);
      }
      // Direct scrollbar dragging should be immediate (not eased)
      moveViewportToValue(v, true);
      scheduleScrollEnd(v);
    },
    [isScrolling, onScrollStart, moveViewportToValue, scheduleScrollEnd]
  );

  const handleChangeEnd = useCallback(
    (v: number) => {
      // Prevent setting scroll value to 0 if it's not intentional
      if (v === 0 && scrollValue > 0.01) {
        return;
      }
      moveViewportToValue(v, true);
      scheduleScrollEnd(v);
    },
    [moveViewportToValue, scheduleScrollEnd, scrollValue]
  );

  // Expose viewport reference and API to parent
  useEffect(() => {
    if (ref.current) {
      onViewportRef?.(ref.current);
    }
    onScrollBoxRef?.(scrollBoxAPI);
  }, [onViewportRef, onScrollBoxRef, scrollBoxAPI]);

  const handleTrackJump = useCallback(
    (v: number) => {
      if (!isScrolling) {
        setIsScrolling(true);
        onScrollStart?.(v);
      }
      // Track jumps should be immediate for real-time cursor following
      moveViewportToValue(v, true);
      scheduleScrollEnd(v);
    },
    [isScrolling, onScrollStart, moveViewportToValue, scheduleScrollEnd]
  );

  // Cleanup viewport animation on unmount
  useEffect(() => {
    return () => {
      if (viewportAnimationRef.current) {
        cancelAnimationFrame(viewportAnimationRef.current);
      }
      if (scrollEndTimerRef.current) {
        window.clearTimeout(scrollEndTimerRef.current);
      }
    };
  }, []);

  return (
    <pixiContainer x={0} y={0} width={width} height={height}>
      <layoutContainer
        label="scrollbox"
        layout={{
          width: width,
          height: height,
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "flex-start",
          overflow: "hidden",
        }}
      >
        <layoutContainer
          layout={{
            width: width,
            height: viewportHeight,
          }}
        >
          <Viewport
            ref={ref}
            screenWidth={width}
            screenHeight={viewportHeight}
            worldWidth={worldWidth}
            worldHeight={worldHeight}
            clampZoomOptions={{
              minScale: 1,
              maxScale: 1,
            }}
            onMoved={updateFromViewport}
          >
            {children}
          </Viewport>
        </layoutContainer>
        <layoutContainer
          layout={{
            width: width,
            height: isBarHidden ? 0 : barThickness,
          }}
        >
          {!isBarHidden && (
            <pixiContainer width={width} height={barThickness}>
              <ScrollBar
                orientation="horizontal"
                length={width}
                thickness={barThickness}
                buttonSize={barButtonSize}
                thumbSize={thumbSize}
                value={scrollValue}
                enableEasing={enableEasing}
                easingDuration={easingDuration}
                easingFunction={easingFunction}
                onChange={handleChange}
                onChangeEnd={handleChangeEnd}
                onTrackJump={handleTrackJump}
                onDecrement={() =>
                  stepBy(-(smallStepPx ?? Math.floor(width * 0.1)))
                }
                onIncrement={() =>
                  stepBy(smallStepPx ?? Math.floor(width * 0.1))
                }
                onPageDecrement={() => stepBy(-(pageStepPx ?? width))}
                onPageIncrement={() => stepBy(pageStepPx ?? width)}
              />
            </pixiContainer>
          )}
        </layoutContainer>
      </layoutContainer>
    </pixiContainer>
  );
}
