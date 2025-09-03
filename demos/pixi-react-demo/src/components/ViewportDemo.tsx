import { useCallback, useEffect, useRef, useState } from "react";
import { useApplication } from "@pixi/react";
import { Viewport } from "pixi-viewport";
import type { MovedEvent, ZoomedEvent } from "pixi-viewport/dist/types";

export function ViewportDemo() {
  // Viewport state
  const [currentZoom, setCurrentZoom] = useState(1);
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });

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

  const { app } = useApplication();
  const viewportRef = useRef<Viewport>(null);

  useEffect(() => {
    if (!viewportRef.current) return;

    const currentViewport = viewportRef.current;

    // Configure viewport with performance-optimized settings
    currentViewport
      .drag({ factor: 1 })
      .pinch({ percent: 0.1 })
      .wheel({ percent: 0.1, smooth: 0.5 })
      .decelerate({ friction: 0.95, minSpeed: 0.01 })
      .clamp({ left: 0, top: 0, right: 2000, bottom: 2000 })
      .clampZoom({ minScale: 0.1, maxScale: 5 });

    currentViewport.on("moved", handleViewportMoved);
    currentViewport.on("zoomed", handleViewportZoomed);

    return () => {
      currentViewport.off("moved", handleViewportMoved);
      currentViewport.off("zoomed", handleViewportZoomed);
    };
  }, [handleViewportMoved, handleViewportZoomed]);

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
        text="Use mouse wheel to zoom, drag to pan"
        x={0}
        y={30}
        style={{
          fill: 0x95a5a6,
          fontSize: 12,
          fontFamily: "Arial",
        }}
      />

      <pixiContainer x={0} y={60} width={600} height={400}>
        <layoutContainer
          layout={{
            width: 600,
            height: 400,
            borderColor: "red",
            borderWidth: 1,
            overflow: "hidden",
          }}
        >
          <pixiViewport
            ref={viewportRef}
            screenWidth={600}
            screenHeight={400}
            worldWidth={2000}
            worldHeight={2000}
            events={app.renderer.events}
            //   onMoved={handleViewportMoved}
            //   onZoomed={handleViewportZoomed}

            //   wheel={true}
            //   wheelOptions={{
            //     percent: 0.1,
            //     reverse: false,
            //     smooth: 1
            //   }}
            //   drag={true}
            //   dragOptions={{
            //     factor: 1,
            //     reverse: false
            //   }}
            //   pinch={true}
            //   pinchOptions={{
            //     percent: 0.1
            //   }}
            //   clamp={true}
            //   clampOptions={{
            //     left: 0,
            //     top: 0,
            //     right: 2000,
            //     bottom: 2000
            //   }}
            //   clampZoom={true}
            //   clampZoomOptions={{
            //     minScale: 0.1,
            //     maxScale: 5
            //   }}
            //   bounce={true}
            //   bounceOptions={{
            //     friction: 0.8,
            //     time: 1000
            //   }}
            //   decelerate={true}
            //   decelerateOptions={{
            //     friction: 0.95,
            //     minSpeed: 0.01
            //   }}
            //   onMoved={handleViewportMoved}
            //   onZoomed={handleViewportZoomed}
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
          </pixiViewport>
        </layoutContainer>
      </pixiContainer>

      <pixiText
        text="Viewport Controls"
        x={0}
        y={480}
        style={{
          fill: 0xffffff,
          fontSize: 16,
          fontFamily: "Arial",
          fontWeight: "bold",
        }}
      />

      <pixiContainer x={0} y={510}>
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
              viewportRef.current?.snap(0, 0, {
                time: 1000,
                removeOnComplete: true,
              });
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
      </pixiContainer>
    </pixiContainer>
  );
}
