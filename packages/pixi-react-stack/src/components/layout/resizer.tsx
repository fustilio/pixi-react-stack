import "@pixi/layout/react";
import "@pixi/layout";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { Container, Text, Graphics, Sprite } from "pixi.js";
import { useApplication, useExtend } from "@pixi/react";
import { LayoutContainer } from "@pixi/layout/components";

type LayoutResizerProps = {
  children:
    | ((dimensions: { width: number; height: number }) => ReactNode)
    | ReactNode;
};

export function LayoutResizer({ children }: LayoutResizerProps) {
  useExtend({
    Container,
    Text,
    Graphics,
    Sprite,
    LayoutContainer,
  });
  const layoutRef = useRef<Container>(null);
  const { app } = useApplication();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!app.renderer) {
      // renderer is not ready yet
      return;
    }

    const resizeListener = () => {
      const { width, height } = app.screen;
      setDimensions({ width, height });
      if (layoutRef.current) {
        layoutRef.current.layout = {
          width,
          height,
        };
      }
    };

    app.renderer.on("resize", resizeListener);
    // Call resizeListener once to set the initial layout
    resizeListener();
    return () => {
      app.renderer.off("resize", resizeListener);
    };
  }, [app, app.renderer]);

  // Pass dimensions as prop to children via React.cloneElement if needed
  // For now, just render children and expose dimensions via context
  return (
    <pixiContainer ref={layoutRef}>
      {app.renderer
        ? typeof children === "function"
          ? (
              children as (dimensions: {
                width: number;
                height: number;
              }) => ReactNode
            )(dimensions)
          : children
        : null}
    </pixiContainer>
  );
}
