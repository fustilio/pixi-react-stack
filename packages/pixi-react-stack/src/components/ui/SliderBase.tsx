import { useCallback, useMemo, useRef, useState } from 'react';
import { Container, FederatedPointerEvent } from 'pixi.js';
import { ProgressBar, type ProgressBarOptions } from './ProgressBar';

export type BaseSliderOptions = ProgressBarOptions & {
    min?: number;
    max?: number;
    step?: number;
    showValue?: boolean;
    valueTextOffset?: {
        x?: number;
        y?: number;
    };
};

export type DoubleSliderOptions = BaseSliderOptions & {
    slider1?: Container | string | (() => React.ReactNode);
    slider2?: Container | string | (() => React.ReactNode);
    value1?: number;
    value2?: number;
};

/**
 * Base slider component that provides common slider functionality.
 * This follows the pixi-react guide patterns for optimal performance.
 */
export function SliderBase(options: DoubleSliderOptions = {}) {
    const {
        min = 0,
        max = 100,
        step = 1,
        showValue = false,
        valueTextOffset = { x: 0, y: 0 },
        slider1,
        slider2,
        value1 = 0,
        value2 = 0,
        ...progressBarOptions
    } = options;

    // State for slider values
    const [sliderValue1, setSliderValue1] = useState(value1);
    const [sliderValue2] = useState(value2);
    const [dragging, setDragging] = useState(0);

    // Refs for tracking drag state
    const startXRef = useRef(0);
    const startValue1Ref = useRef(0);
    const startValue2Ref = useRef(0);
    const bgRef = useRef<Container>(null);

    // Validate and clamp values
    const validateValue = useCallback((value: number): number => {
        let val = Math.round(value / step) * step; // Snap to step
        if (val < min) val = min;
        if (val > max) val = max;
        return val;
    }, [min, max, step]);

    // Handle drag start
    const handleDragStart = useCallback((event: FederatedPointerEvent) => {
        setDragging(1);
        const obj = event.currentTarget as Container;
        startXRef.current = obj.parent?.worldTransform.applyInverse(event.global).x || 0;
        startValue1Ref.current = sliderValue1;
        startValue2Ref.current = sliderValue2;
    }, [sliderValue1, sliderValue2]);

    // Handle drag end
    const handleDragEnd = useCallback(() => {
        if (!dragging) return;
        setDragging(0);

        // Check if values actually changed
        if (
            startXRef.current !== 0 ||
            startValue1Ref.current !== sliderValue1 ||
            startValue2Ref.current !== sliderValue2
        ) {
            // Emit change event here if needed
            console.log('Slider values changed:', { value1: sliderValue1, value2: sliderValue2 });
        }

        // Reset start values
        startValue1Ref.current = 0;
        startValue2Ref.current = 0;
    }, [dragging, sliderValue1, sliderValue2]);

    // Handle drag move
    const handleDragMove = useCallback((event: FederatedPointerEvent) => {
        if (!dragging) return;

        const obj = event.currentTarget as Container;
        const { x } = obj.parent?.worldTransform.applyInverse(event.global) || { x: 0 };

        if (x !== startXRef.current) {
            startXRef.current = 0;
        }

        // Calculate new value based on position
        const bgWidth = bgRef.current?.width || 1;
        const positionRatio = x / bgWidth;
        const rawValue = min + (positionRatio * (max - min));
        const newValue = validateValue(rawValue);

        setSliderValue1(newValue);
    }, [dragging, min, max, validateValue]);

    // Calculate progress for progress bar
    const progress = useMemo(() => {
        return ((sliderValue1 - min) / (max - min)) * 100;
    }, [sliderValue1, min, max]);

    // Calculate slider positions
    const slider1Position = useMemo(() => {
        const bgWidth = bgRef.current?.width || 0;
        return (bgWidth / 100) * progress;
    }, [progress]);

    const slider2Position = useMemo(() => {
        const bgWidth = bgRef.current?.width || 0;
        return (bgWidth / 100) * ((sliderValue2 - min) / (max - min)) * 100;
    }, [sliderValue2, min, max]);

    // Render custom slider handle
    const renderSliderHandle1 = useMemo(() => {
        if (typeof slider1 === 'function') {
            // Function-based slider handle
            return slider1();
        } else if (typeof slider1 === 'string') {
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
    }, [slider1]);

    const renderSliderHandle2 = useMemo(() => {
        if (typeof slider2 === 'function') {
            // Function-based slider handle
            return slider2();
        } else if (typeof slider2 === 'string') {
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
    }, [slider2]);

    return (
        <pixiContainer>
            {/* Progress bar background */}
            <ProgressBar
                {...progressBarOptions}
                progress={progress}
                width={progressBarOptions.width || 200}
                height={progressBarOptions.height || 20}
            />

            {/* Slider 1 */}
            {slider1 && (
                <pixiContainer
                    x={slider1Position}
                    y={(progressBarOptions.height || 20) / 2}
                    eventMode="static"
                    cursor="pointer"
                    onPointerDown={handleDragStart}
                    onPointerUp={handleDragEnd}
                    onPointerUpOutside={handleDragEnd}
                    onGlobalPointerMove={handleDragMove}
                >
                    {renderSliderHandle1}
                </pixiContainer>
            )}

            {/* Slider 2 (for double slider) */}
            {slider2 && (
                <pixiContainer
                    x={slider2Position}
                    y={(progressBarOptions.height || 20) / 2}
                    eventMode="static"
                    cursor="pointer"
                    onPointerDown={handleDragStart}
                    onPointerUp={handleDragEnd}
                    onPointerUpOutside={handleDragEnd}
                    onGlobalPointerMove={handleDragMove}
                >
                    {renderSliderHandle2}
                </pixiContainer>
            )}

            {/* Value text display */}
            {showValue && (
                <pixiText
                    text={`${Math.round(sliderValue1)}`}
                    x={slider1Position + (valueTextOffset.x || 0)}
                    y={(progressBarOptions.height || 20) / 2 + (valueTextOffset.y || 0)}
                    anchor={0.5}
                    style={{ fill: 0xffffff, fontSize: 14 }}
                />
            )}
        </pixiContainer>
    );
}