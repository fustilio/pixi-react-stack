import { useCallback, useEffect, useRef, useState } from "react";
import { Viewport as PixiViewport } from "pixi-viewport";
import type { MovedEvent, ZoomedEvent } from "pixi-viewport/dist/types";

import { Viewport } from "../components/ui/Viewport";

export function ViewportDemoTwo() {
  // Viewport state
  const [currentZoom, setCurrentZoom] = useState(1);
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [mouseEdgesActive, setMouseEdgesActive] = useState(false);

  const ref = useRef<PixiViewport>(null);

  // Viewport event handlers - throttled to reduce performance impact
  const handleViewportMoved = useCallback((event: MovedEvent) => {
    // Throttle updates to reduce re-renders
    setCurrentPosition((prev) => {
      const newPos = {
        x: Math.round(event.viewport.corner.x),
        y: Math.round(event.viewport.corner.y),
      };
      // Only update if position changed significantly
      if (Math.abs(prev.x - newPos.x) > 5 || Math.abs(prev.y - newPos.y) > 5) {
        return newPos;
      }
      return prev;
    });
  }, []);

  const handleViewportZoomed = useCallback((event: ZoomedEvent) => {
    // Throttle zoom updates
    setCurrentZoom((prev) => {
      const newZoom = Math.round(event.viewport.scale.x * 100) / 100;
      if (Math.abs(prev - newZoom) > 0.01) {
        return newZoom;
      }
      return prev;
    });
  }, []);

  // Mouse edges event handlers
  const handleMouseEdgeStart = useCallback(() => {
    console.log("Mouse edges start");
    setMouseEdgesActive(true);
  }, []);

  const handleMouseEdgeEnd = useCallback(() => {
    console.log("Mouse edges end");
    setMouseEdgesActive(false);
  }, []);

  // Mouse edge radius from the options
  const mouseEdgeDistance = 50;
  const mouseEdgeRadius = 150;
  const [useDistanceMode, setUseDistanceMode] = useState(false);

  // Toggle between distance and radius modes
  const toggleEdgeMode = useCallback(() => {
    setUseDistanceMode((prev) => !prev);
  }, []);

  // Get the appropriate mouse edges options based on mode
  const getMouseEdgesOptions = () => {
    if (useDistanceMode) {
      return {
        distance: mouseEdgeDistance,
        speed: 8,
        allowButtons: true,
      };
    } else {
      return {
        radius: mouseEdgeRadius,
        speed: 8,
        allowButtons: true,
      };
    }
  };

  // demonstrate imperative handle
  useEffect(() => {
    const currentRef = ref.current;

    if (!currentRef) return;

    const handle = () => {
      console.log("logging imperative handle zoomed");
    };

    currentRef.on("zoomed", handle);

    return () => {
      currentRef.off("zoomed", handle);
    };
  }, [ref]);

  return (
    <pixiContainer>
      {/* Viewport Demo */}
      <pixiText
        text="Viewport Component - Interactive Camera/Viewport"
        x={0}
        y={-20}
        style={{
          fill: 0xffffff,
          fontSize: 18,
          fontFamily: "Arial",
          fontWeight: "bold",
        }}
      />

      <pixiText
        text={`Zoom: ${currentZoom}x | Position: (${currentPosition.x}, ${currentPosition.y})`}
        x={0}
        y={10}
        style={{
          fill: 0x3498db,
          fontSize: 14,
          fontFamily: "Arial",
        }}
      />

      <pixiText
        text="Use mouse wheel to zoom, drag to pan, move mouse to edges for auto-scroll"
        x={0}
        y={30}
        style={{
          fill: 0x95a5a6,
          fontSize: 12,
          fontFamily: "Arial",
        }}
      />

      {/* Mouse edges status indicator */}
      <pixiText
        text={`Mouse Edges: ${mouseEdgesActive ? "🟢 Active" : "⚪ Inactive"}`}
        x={0}
        y={50}
        style={{
          fill: mouseEdgesActive ? 0x2ecc71 : 0x95a5a6,
          fontSize: 12,
          fontFamily: "Arial",
          fontWeight: mouseEdgesActive ? "bold" : "normal",
        }}
      />

      {/* Edge calculation mode indicator */}
      <pixiText
        text={`Mode: ${useDistanceMode ? "📏 Distance" : "🔴 Radius"} (${mouseEdgeRadius}px)`}
        x={0}
        y={70}
        style={{
          fill: useDistanceMode ? 0x3498db : 0xff6b6b,
          fontSize: 12,
          fontFamily: "Arial",
          fontWeight: "bold",
        }}
      />

      <pixiContainer x={0} y={80} width={600} height={400}>
        {/* Mouse Edge Regions Visualization - Screen Relative */}
        {useDistanceMode ? (
          // Distance mode: Fixed distance from each edge (like a border)
          <>
            {/* Top edge region */}
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.rect(0, 0, 600, mouseEdgeDistance)
                  .fill({ color: 0x3498db, alpha: 0.3 })
                  .stroke({ width: 2, color: 0x3498db, alpha: 0.7 });
              }}
            />

            {/* Bottom edge region */}
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.rect(0, 400 - mouseEdgeDistance, 600, mouseEdgeDistance)
                  .fill({ color: 0x3498db, alpha: 0.3 })
                  .stroke({ width: 2, color: 0x3498db, alpha: 0.7 });
              }}
            />

            {/* Left edge region */}
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.rect(0, 0, mouseEdgeDistance, 400)
                  .fill({ color: 0x3498db, alpha: 0.3 })
                  .stroke({ width: 2, color: 0x3498db, alpha: 0.7 });
              }}
            />

            {/* Right edge region */}
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.rect(600 - mouseEdgeDistance, 0, mouseEdgeDistance, 400)
                  .fill({ color: 0x3498db, alpha: 0.3 })
                  .stroke({ width: 2, color: 0x3498db, alpha: 0.7 });
              }}
            />

            {/* Edge region labels for Distance mode */}
            <pixiText
              text="TOP EDGE"
              x={300}
              y={mouseEdgeDistance / 2}
              anchor={0.5}
              style={{
                fill: 0x3498db,
                fontSize: 14,
                fontFamily: "Arial",
                fontWeight: "bold",
              }}
            />

            <pixiText
              text="BOTTOM EDGE"
              x={300}
              y={400 - mouseEdgeDistance / 2}
              anchor={0.5}
              style={{
                fill: 0x3498db,
                fontSize: 14,
                fontFamily: "Arial",
                fontWeight: "bold",
              }}
            />

            <pixiText
              text="LEFT EDGE"
              x={mouseEdgeDistance / 2}
              y={200}
              anchor={0.5}
              style={{
                fill: 0x3498db,
                fontSize: 14,
                fontFamily: "Arial",
                fontWeight: "bold",
              }}
            />

            <pixiText
              text="RIGHT EDGE"
              x={600 - mouseEdgeDistance / 2}
              y={200}
              anchor={0.5}
              style={{
                fill: 0x3498db,
                fontSize: 14,
                fontFamily: "Arial",
                fontWeight: "bold",
              }}
            />
          </>
        ) : (
          // Radius mode: Circular zone from center
          <>
            <pixiGraphics
              draw={(g) => {
                g.clear();
                // Draw the actual trigger radius (50px from center)
                g.circle(300, 200, mouseEdgeRadius)
                  .fill({ color: 0xff6b6b, alpha: 0.3 })
                  .stroke({ width: 2, color: 0xff6b6b, alpha: 0.7 });

                // Draw a circle to show the viewport center
                g.circle(300, 200, 50).stroke({
                  width: 1,
                  color: 0xff6b6b,
                  alpha: 0.5,
                });
              }}
            />

            {/* Center label for Radius mode */}
            <pixiText
              text="CENTER"
              x={300}
              y={200}
              anchor={0.5}
              style={{
                fill: 0xff6b6b,
                fontSize: 14,
                fontFamily: "Arial",
                fontWeight: "bold",
              }}
            />

            <pixiText
              text={`${mouseEdgeRadius}px radius`}
              x={300}
              y={200 + mouseEdgeRadius + 20}
              anchor={0.5}
              style={{
                fill: 0xff6b6b,
                fontSize: 12,
                fontFamily: "Arial",
              }}
            />
          </>
        )}

        <layoutContainer
          label="le viewpore"
          layout={{
            width: 600,
            height: 400,
            borderColor: "red",
            borderWidth: 1,
            overflow: "hidden",
          }}
        >
          <Viewport
            ref={ref}
            screenWidth={600}
            screenHeight={400}
            worldWidth={2000}
            worldHeight={2000}
            onMoved={handleViewportMoved}
            onZoomed={handleViewportZoomed}
            dragOptions={{
              factor: 1,
              // reverse: false,
            }}
            mouseEdgesOptions={getMouseEdgesOptions()}
            // onMouseEdges={handleMouseEdges}

            onMouseEdgeEnd={handleMouseEdgeEnd}
            onMouseEdgeStart={handleMouseEdgeStart}
            // onMovedEnd={handleMovedEnd}
          >
            {/* Background grid - optimized with fewer lines */}
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.setStrokeStyle({
                  width: 2,
                  color: 0xcccccc,
                  alpha: 0.5,
                });

                // Draw fewer grid lines for better performance
                // Vertical lines every 200px instead of 100px
                for (let x = 0; x <= 2000; x += 200) {
                  g.moveTo(x, 0);
                  g.lineTo(x, 2000);
                }

                // Horizontal lines every 200px instead of 100px
                for (let y = 0; y <= 2000; y += 200) {
                  g.moveTo(0, y);
                  g.lineTo(2000, y);
                }

                g.stroke();
              }}
            />

            {/* Sample objects - reduced count for better performance */}
            {Array.from({ length: 10 }, (_, i) => (
              <pixiContainer key={i} x={200 + i * 300} y={200 + i * 200}>
                <pixiGraphics
                  draw={(g) => {
                    g.clear();
                    g.circle(0, 0, 25 + i * 3).fill({
                      color: 0x3498db + i * 2000,
                    });
                  }}
                />
                <pixiText
                  text={`Obj ${i + 1}`}
                  x={0}
                  y={0}
                  anchor={0.5}
                  style={{ fontSize: 10, fill: 0xffffff }}
                />
              </pixiContainer>
            ))}

            {/* Center marker */}
            <pixiGraphics
              x={1000}
              y={1000}
              draw={(g) => {
                g.clear();
                g.circle(0, 0, 50).stroke({
                  color: 0xe74c3c,
                  width: 3,
                });
                g.moveTo(-60, 0).lineTo(60, 0).stroke({
                  width: 1,
                  color: 0xe74c3c,
                });
                g.moveTo(0, -60).lineTo(0, 60).stroke({
                  width: 1,
                  color: 0xe74c3c,
                });
              }}
            />

            {/* Corner markers */}
            <pixiGraphics
              x={0}
              y={0}
              draw={(g) => {
                g.clear();
                g.rect(0, 0, 20, 20)
                  .fill({ color: 0x2ecc71 })
                  .stroke({ width: 2, color: 0x2ecc71 });
              }}
            />
            <pixiGraphics
              x={1980}
              y={0}
              draw={(g) => {
                g.clear();
                g.rect(0, 0, 20, 20)
                  .fill({ color: 0x2ecc71 })
                  .stroke({ width: 2, color: 0x2ecc71 });
              }}
            />
            <pixiGraphics
              x={0}
              y={1980}
              draw={(g) => {
                g.clear();
                g.rect(0, 0, 20, 20)
                  .fill({ color: 0x2ecc71 })
                  .stroke({ width: 2, color: 0x2ecc71 });
              }}
            />
            <pixiGraphics
              x={1980}
              y={1980}
              draw={(g) => {
                g.clear();
                g.rect(0, 0, 20, 20)
                  .fill({ color: 0x2ecc71 })
                  .stroke({ width: 2, color: 0x2ecc71 });
              }}
            />
          </Viewport>
        </layoutContainer>
      </pixiContainer>

      {/* Mouse Edge Regions Info */}
      <pixiText
        text="Mouse Edge Regions (Red Areas)"
        x={0}
        y={500}
        style={{
          fill: 0xffffff,
          fontSize: 16,
          fontFamily: "Arial",
          fontWeight: "bold",
        }}
      />

      {/* Bug Note */}
      <pixiText
        text="⚠️ BUG: Distance mode uses global cursor coords instead of viewport-relative coords"
        x={0}
        y={520}
        style={{
          fill: 0xff6b6b,
          fontSize: 12,
          fontFamily: "Arial",
          fontWeight: "bold",
        }}
      />

      <pixiText
        text={`Move mouse within ${useDistanceMode ? mouseEdgeDistance : mouseEdgeRadius}px ${useDistanceMode ? "from edges" : "from center"} to trigger auto-scroll (${useDistanceMode ? "Distance" : "Radius"} mode)`}
        x={0}
        y={530}
        style={{
          fill: useDistanceMode ? 0x3498db : 0xff6b6b,
          fontSize: 14,
          fontFamily: "Arial",
        }}
      />

      {/* Technical Details */}
      <pixiText
        text={`Distance: ${mouseEdgeDistance}px | Radius: ${mouseEdgeRadius}px`}
        x={0}
        y={550}
        style={{
          fill: 0x95a5a6,
          fontSize: 12,
          fontFamily: "Arial",
        }}
      />

      <pixiText
        text="Viewport Controls"
        x={0}
        y={590}
        style={{
          fill: 0xffffff,
          fontSize: 16,
          fontFamily: "Arial",
          fontWeight: "bold",
        }}
      />

      <pixiContainer x={0} y={620}>
        <pixiContainer x={0} y={0}>
          <pixiGraphics
            draw={(g) => {
              g.clear()
                .roundRect(0, 0, 120, 40, 6)
                .fill(0xe74c3c)
                .stroke({ width: 2, color: 0xffffff });
            }}
            interactive={true}
            onPointerDown={() => {
              // Reset viewport to center
              console.log("🔍 Reset viewport to center");
            }}
          />
          <pixiText
            text="Reset View"
            x={60}
            y={20}
            anchor={0.5}
            style={{
              fill: 0xffffff,
              fontSize: 14,
              fontFamily: "Arial",
              fontWeight: "bold",
            }}
          />
        </pixiContainer>

        {/* Toggle Edge Mode Button */}
        <pixiContainer x={140} y={0}>
          <pixiGraphics
            draw={(g) => {
              g.clear()
                .roundRect(0, 0, 140, 40, 6)
                .fill(useDistanceMode ? 0x3498db : 0xff6b6b)
                .stroke({ width: 2, color: 0xffffff });
            }}
            interactive={true}
            onPointerDown={toggleEdgeMode}
          />
          <pixiText
            text={`Switch to ${useDistanceMode ? "Radius" : "Distance"}`}
            x={70}
            y={20}
            anchor={0.5}
            style={{
              fill: 0xffffff,
              fontSize: 12,
              fontFamily: "Arial",
              fontWeight: "bold",
            }}
          />
        </pixiContainer>
      </pixiContainer>
    </pixiContainer>
  );
}
