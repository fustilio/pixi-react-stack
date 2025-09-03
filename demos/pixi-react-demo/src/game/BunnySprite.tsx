import { useRef, useState, useEffect } from "react";
import type { FC } from "react";
import { Texture } from "pixi.js";
import { useGameLoop } from "./useGameLoop";
import { useAsset } from "./useAsset";

// BunnySpriteProps for bouncing logic
export type BunnySpriteProps = {
  bounds?: {
    width: number;
    height: number;
    margin: number;
    size: number;
  };
  onUpdate?: (info: { x: number; y: number; radius: number; scale: number }) => void;
};

const BUNNY_URL = "https://pixijs.com/assets/bunny.png";

export const BunnySprite: FC<BunnySpriteProps> = ({ bounds, onUpdate }) => {
  const spriteRef = useRef(null);
  const texture = useAsset(BUNNY_URL);
  const [_, setIsHover] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [rotation, setRotation] = useState(0);
  // Position and velocity for bouncing
  const [pos, setPos] = useState(() => {
    if (bounds) {
      return {
        x: bounds.width / 2,
        y: bounds.height / 2,
        vx: 180,
        vy: 150,
      };
    }
    return { x: 100, y: 100, vx: 180, vy: 150 };
  });
  const scale = isActive ? 1 : 1.5;
  const radius = (bounds?.size ?? 48) / 2 * scale;

  // Bouncing logic (frame-rate independent)
  useGameLoop((delta) => {
    setRotation((rotation) => rotation + 2.5 * delta);
    if (!bounds) return;
    setPos((prev) => {
      let { x, y, vx, vy } = prev;
      const { width, height, margin } = bounds;
      // Use radius instead of size/2 for correct hitbox collision
      const minX = margin + radius;
      const minY = margin + radius;
      const maxX = width - margin - radius;
      const maxY = height - margin - radius;
      x += vx * delta;
      y += vy * delta;
      if (x < minX) {
        x = minX;
        vx = Math.abs(vx);
      } else if (x > maxX) {
        x = maxX;
        vx = -Math.abs(vx);
      }
      if (y < minY) {
        y = minY;
        vy = Math.abs(vy);
      } else if (y > maxY) {
        y = maxY;
        vy = -Math.abs(vy);
      }
      return { x, y, vx, vy };
    });
  });

  // Call onUpdate with current collision info
  useEffect(() => {
    if (onUpdate) {
      onUpdate({ x: bounds ? pos.x : 100, y: bounds ? pos.y : 100, radius, scale });
    }
    // Only update when position, radius, or scale changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos.x, pos.y, radius, scale, onUpdate]);

  return (
    <pixiSprite
      ref={spriteRef}
      anchor={0.5}
      eventMode={"static"}
      cursor={"pointer"}
      onClick={() => setIsActive(!isActive)}
      onPointerOver={() => setIsHover(true)}
      onPointerOut={() => setIsHover(false)}
      scale={scale}
      texture={texture ?? Texture.EMPTY}
      x={bounds ? pos.x : 100}
      y={bounds ? pos.y : 100}
      rotation={rotation}
    />
  );
};
