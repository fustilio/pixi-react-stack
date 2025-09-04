import { type IconNode } from "lucide";

import { lucideToSvg } from "../../icons/lucide-to-svg";

import type { ColorSource } from "pixi.js";

export type IconProps = {
  icon: IconNode;
  size?: number;
  color?: ColorSource;
  rotation?: number;
};

/**
 * for now, our scaling strategy of svg uses pixiContainer to scale the svg
 */
export function Icon({ icon, size = 24, color, rotation }: IconProps) {
  return (
    <pixiContainer
      width={size}
      height={size}
      origin={{ x: size / 2, y: size / 2 }}
      rotation={rotation}
   
    >
      <pixiContainer
        width={size}
        height={size}
        scale={{
          x: size / 24,
          y: size / 24,
        }}
      >
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.svg(
              lucideToSvg(
                icon,
                {
                  width: size / 2,
                  height: size / 2,
                },
                color
              )
            );
          }}
        />
      </pixiContainer>
    </pixiContainer>
  );
}
