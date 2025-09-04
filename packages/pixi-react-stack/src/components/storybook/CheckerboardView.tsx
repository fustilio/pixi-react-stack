import type { PixiReactElementProps } from "@pixi/react";
import type { Container } from "pixi.js";


export function CheckerboardView({
  children,
  grids = 16,
  darkColor = "#aaaaaa",
  lightColor = "white",
  width = 512,
  height = 512,
  ...rest
}: PixiReactElementProps<typeof Container> & { grids?: number; darkColor?: string; lightColor?: string }) {
  const rows = new Array(grids).fill(null);
  const cols = new Array(grids).fill(null);

  return (
    <pixiContainer
      width={width}
      height={height}
      {...rest}
    
    >
      <layoutContainer layout={{
        width: width,
        height: height,
        flexDirection: "row",
        flexWrap: "wrap",
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        overflow: "hidden",
      }}>
        {rows.map((_, rowIndex) => (
          <layoutContainer key={rowIndex} layout={{
            width: width,
            height: height / grids,
            flexDirection: "row",
          }}>
            {cols.map((_, colIndex) => (
              <layoutContainer
                key={colIndex}
                layout={{
                  width: width / grids,
                  height: height / grids,
                  backgroundColor:
                    (rowIndex + colIndex) % 2 === 0 ? lightColor : darkColor,
                }}
               />
            ))}
          </layoutContainer>
        ))}
      </layoutContainer>
      {children}
    </pixiContainer>
  );
}
