import { type PropsWithChildren } from "react";
import { Container, Text, Graphics, Sprite } from "pixi.js";
import { useExtend } from "@pixi/react";
import { Viewport } from "pixi-viewport";
import { LayoutContainer, LayoutView } from "@pixi/layout/components";

export function Wrapper({ children }: PropsWithChildren<{}>) {
  useExtend({
    Container,
    Text,
    Graphics,
    Sprite,
    LayoutContainer,
    LayoutView,
    Viewport
  });
  return <pixiContainer>
    {children}
  </pixiContainer>
}
