import "@pixi/layout/react";
import "@pixi/layout";

import { useState } from "react";
import { Application } from "@pixi/react";

import { LayoutResizer } from "@fustilio/pixi-react-stack/layout";

import { BunnySprite } from "./BunnySprite";
import { DebugOverlay } from "./DebugOverlay";

// Centralized layout constants
const ARTIFACT_SIZE = 32;
const MARGIN = 24;
const PADDING = 12;

// Helper to draw margin and padding boxes centered at (cx, cy)
function drawMarginAndPaddingBox(
  cx: number,
  cy: number,
  contentW: number,
  contentH: number,
  margin: number,
  padding: number,
  marginColor: number,
  paddingColor: number
) {
  const marginW = contentW + 2 * (padding + margin);
  const marginH = contentH + 2 * (padding + margin);
  const paddingW = contentW + 2 * padding;
  const paddingH = contentH + 2 * padding;
  const marginX = cx - marginW / 2;
  const marginY = cy - marginH / 2;
  const paddingX = cx - paddingW / 2;
  const paddingY = cy - paddingH / 2;
  return [
    <pixiGraphics
      key="margin-box"
      draw={g => {
        g.clear();
        g.rect(marginX, marginY, marginW, marginH)
          .stroke({ width: 2, color: marginColor, alpha: 0.7 })
          .fill({ color: marginColor, alpha: 0.15 });
        return g;
      }}
    />,
    <pixiGraphics
      key="padding-box"
      draw={g => {
        g.clear();
        g.rect(paddingX, paddingY, paddingW, paddingH)
          .stroke({ width: 2, color: paddingColor, alpha: 0.7 })
          .fill({ color: paddingColor, alpha: 0.15 });
        return g;
      }}
    />
  ];
}

export function PixiReactDemo() {
  // We'll use a render prop to get dimensions from LayoutResizer
  const [bunnyCollision, setBunnyCollision] = useState<{
    x: number;
    y: number;
    radius: number;
    scale: number;
  } | null>(null);
  const bounceMargin = MARGIN + PADDING;
  const bounceSize = 48;
  return (
    <Application background="#000022" resizeTo={window} autoStart={true}>
      <LayoutResizer>
        {(dimensions: { width: number; height: number }) => {
          const { width, height } = dimensions;
          // Centered dimension label with margin/padding
          const centerText = `Size: ${width} x ${height}`;
          const fontSize = 24;
          const textWidth = fontSize * centerText.length * 0.6;
          const textHeight = fontSize;
          // Draw margin and padding boxes for the center text
          const centerBoxes = drawMarginAndPaddingBox(
            width / 2,
            height / 2,
            textWidth,
            textHeight,
            MARGIN,
            PADDING,
            0xff0000,
            0x0000ff
          );
          return (
            <pixiContainer>
              {/* Responsive background rectangle */}
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.fill({ color: 0x222244 });
                  g.rect(0, 0, width, height);
                  return g;
                }}
              />
              {/* Top right artifact with margin/padding */}
              {drawMarginAndPaddingBox(
                width - (MARGIN + PADDING + ARTIFACT_SIZE / 2),
                MARGIN + PADDING + ARTIFACT_SIZE / 2,
                ARTIFACT_SIZE,
                ARTIFACT_SIZE,
                MARGIN,
                PADDING,
                0xff0000,
                0x0000ff
              )}
              {/* Artifact */}
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.fill({ color: 0xff5555 }).circle(
                    width - (MARGIN + PADDING + ARTIFACT_SIZE / 2),
                    MARGIN + PADDING + ARTIFACT_SIZE / 2,
                    ARTIFACT_SIZE / 2,
                  );
                  return g;
                }}
              />
              {/* Bottom left artifact with margin/padding */}
              {drawMarginAndPaddingBox(
                MARGIN + PADDING + ARTIFACT_SIZE / 2,
                height - (MARGIN + PADDING + ARTIFACT_SIZE / 2),
                ARTIFACT_SIZE,
                ARTIFACT_SIZE,
                MARGIN,
                PADDING,
                0xff0000,
                0x0000ff
              )}
              {/* Artifact */}
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.fill({ color: 0x55ff55 }).circle(
                    MARGIN + PADDING + ARTIFACT_SIZE / 2,
                    height - (MARGIN + PADDING + ARTIFACT_SIZE / 2),
                    ARTIFACT_SIZE / 2,
                  );
                  return g;
                }}
              />
              {/* Bottom right artifact with margin/padding */}
              {drawMarginAndPaddingBox(
                width - (MARGIN + PADDING + ARTIFACT_SIZE / 2),
                height - (MARGIN + PADDING + ARTIFACT_SIZE / 2),
                ARTIFACT_SIZE,
                ARTIFACT_SIZE,
                MARGIN,
                PADDING,
                0xff0000,
                0x0000ff
              )}
              {/* Artifact */}
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.fill({ color: 0x5555ff }).circle(
                    width - (MARGIN + PADDING + ARTIFACT_SIZE / 2),
                    height - (MARGIN + PADDING + ARTIFACT_SIZE / 2),
                    ARTIFACT_SIZE / 2,
                  );
                  return g;
                }}
              />
              {/* Top left artifact with margin/padding */}
              {drawMarginAndPaddingBox(
                MARGIN + PADDING + ARTIFACT_SIZE / 2,
                MARGIN + PADDING + ARTIFACT_SIZE / 2,
                ARTIFACT_SIZE,
                ARTIFACT_SIZE,
                MARGIN,
                PADDING,
                0xff0000,
                0x0000ff
              )}
              {/* Artifact */}
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.fill({ color: 0x55ff55 }).circle(
                    MARGIN + PADDING + ARTIFACT_SIZE / 2,
                    MARGIN + PADDING + ARTIFACT_SIZE / 2,
                    ARTIFACT_SIZE / 2,
                  );
                  return g;
                }}
              />
              {/* Bounce surface (where the sprite bounces) */}
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.rect(
                    bounceMargin + bounceSize / 2,
                    bounceMargin + bounceSize / 2,
                    width - 2 * (bounceMargin + bounceSize / 2),
                    height - 2 * (bounceMargin + bounceSize / 2),
                  )
                    .stroke({ width: 3, color: 0xffc107, alpha: 1 })
                    .fill({ color: 0xffc107, alpha: 0.08 });

                  return g;
                }}
              />
              <pixiText
                text="Bounce Surface"
                x={width / 2}
                y={MARGIN + PADDING + 24}
                anchor={0.5}
                style={{
                  fill: 0xffc107,
                  fontSize: 16,
                  fontFamily: "monospace",
                  fontWeight: "bold",
                }}
              />
              {/* Stage border (triggers bounce) */}
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.rect(0, 0, width, height).stroke({
                    width: 3,
                    color: 0xffffff,
                    alpha: 0.7,
                  });

                  return g;
                }}
              />
              <pixiText
                text="Stage Border"
                x={width - 100}
                y={MARGIN + 8}
                anchor={0}
                style={{
                  fill: 0xffffff,
                  fontSize: 14,
                  fontFamily: "monospace",
                }}
              />
              {/* Bunny collision box */}
              {bunnyCollision && (
                <pixiGraphics
                  draw={(g) => {
                    g.clear();
                    g.circle(
                      bunnyCollision.x,
                      bunnyCollision.y,
                      bunnyCollision.radius,
                    )
                      .stroke({ width: 2, color: 0x00ffff, alpha: 1 })
                      .fill({ color: 0x00ffff, alpha: 0.15 });

                    return g;
                  }}
                />
              )}
              <BunnySprite
                bounds={{
                  width,
                  height,
                  margin: bounceMargin + bounceSize / 2,
                  size: bounceSize,
                }}
                onUpdate={setBunnyCollision}
              />
              <DebugOverlay />
              {/* Center margin and padding boxes */}
              {centerBoxes}
              {/* Centered dimension label */}
              <pixiText
                text={centerText}
                x={width / 2}
                y={height / 2}
                anchor={0.5}
                style={{
                  fill: "#fff",
                  fontSize,
                  fontFamily: "monospace",
                  fontWeight: "bold",
                }}
              />
            </pixiContainer>
          );
        }}
      </LayoutResizer>
    </Application>
  );
}
