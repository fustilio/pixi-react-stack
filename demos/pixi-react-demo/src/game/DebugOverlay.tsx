import { useState, useEffect } from "react";
import { useApplication } from "@pixi/react";
import { useGameLoop } from "./useGameLoop";

export function DebugOverlay() {
  const { app } = useApplication();
  const [fps, setFps] = useState(0);
  const [visible, setVisible] = useState(
    process.env.NODE_ENV === "development"
  );

  useGameLoop(() => {
    setFps(app.ticker.FPS);
  });

  useEffect(() => {
    const toggle = (e: KeyboardEvent) => {
      if (e.key === "`") setVisible((v) => !v);
    };
    window.addEventListener("keydown", toggle);
    return () => window.removeEventListener("keydown", toggle);
  }, []);

  if (!visible) return null;

  return (
    <pixiContainer>
      <pixiText
        text={`FPS: ${Math.round(fps)}`}
        style={{ fill: "white", fontSize: 14, stroke: { color: "black", width: 2 } }}
        x={10}
        y={10}
      />
    </pixiContainer>
  );
} 