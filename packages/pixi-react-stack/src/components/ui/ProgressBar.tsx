import { useCallback, useMemo } from 'react';
import { Graphics } from 'pixi.js';

type FillPaddings = {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
};

export type ProgressBarOptions = {
    progress?: number;
    width?: number;
    height?: number;
    fillPaddings?: FillPaddings;
    backgroundColor?: number;
    fillColor?: number;
    borderColor?: number;
    borderWidth?: number;
    borderRadius?: number;
};

/**
 * Creates a ProgressBar using pixi-react with clean, declarative rendering.
 * This follows the pixi-react guide patterns for optimal performance.
 * 
 * @example
 * <ProgressBar 
 *     progress={50} 
 *     width={200} 
 *     height={20}
 *     backgroundColor={0x333333}
 *     fillColor={0x4CAF50}
 * />
 */
export function ProgressBar(options: ProgressBarOptions = {}) {
    const {
        progress = 0,
        width = 200,
        height = 20,
        fillPaddings = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        },
        backgroundColor = 0xcccccc,
        fillColor = 0x4CAF50,
        borderColor = 0x999999,
        borderWidth = 1,
        borderRadius = 0,
    } = options;

    // Validate progress value (0-100)
    const validatedProgress = useMemo(() => {
        const prog = Math.round(progress);
        if (prog < 0) return 0;
        if (prog > 100) return 100;
        return prog;
    }, [progress]);

    // Calculate fill dimensions based on progress and padding
    const fillWidth = useMemo(() => {
        const baseWidth = width - (fillPaddings.left || 0) - (fillPaddings.right || 0);
        return (baseWidth / 100) * validatedProgress;
    }, [width, fillPaddings.left, fillPaddings.right, validatedProgress]);

    const fillHeight = useMemo(() => {
        return height - (fillPaddings.top || 0) - (fillPaddings.bottom || 0);
    }, [height, fillPaddings.top, fillPaddings.bottom]);

    // Draw background with border
    const drawBackground = useCallback((g: Graphics) => {
        g.clear();
        
        // Draw border if specified
        if (borderWidth > 0) {
            g.setStrokeStyle({
                width: borderWidth,
                color: borderColor,
                alpha: 1,
            });
        }
        
        // Draw background
        g.beginFill(backgroundColor);
        if (borderRadius > 0) {
            g.drawRoundedRect(0, 0, width, height, borderRadius);
        } else {
            g.drawRect(0, 0, width, height);
        }
        g.endFill();
    }, [width, height, backgroundColor, borderColor, borderWidth, borderRadius]);

    // Draw fill bar
    const drawFill = useCallback((g: Graphics) => {
        g.clear();
        g.beginFill(fillColor);
        
        const x = fillPaddings.left || 0;
        const y = fillPaddings.top || 0;
        
        if (borderRadius > 0) {
            // For rounded corners, we need to handle the fill carefully
            const cornerRadius = Math.min(borderRadius, Math.min(fillWidth, fillHeight) / 2);
            g.drawRoundedRect(x, y, fillWidth, fillHeight, cornerRadius);
        } else {
            g.drawRect(x, y, fillWidth, fillHeight);
        }
        g.endFill();
    }, [fillWidth, fillHeight, fillColor, fillPaddings.left, fillPaddings.top, borderRadius]);

    return (
        <pixiContainer>
            {/* Background with border */}
            <pixiGraphics draw={drawBackground} />
            
            {/* Progress fill */}
            {validatedProgress > 0 && (
                <pixiGraphics draw={drawFill} />
            )}
        </pixiContainer>
    );
}
