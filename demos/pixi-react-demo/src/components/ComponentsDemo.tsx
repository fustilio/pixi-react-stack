import { useCallback, useMemo, useState } from "react";
import { useApplication } from "@pixi/react";
import { Container, Graphics } from "pixi.js";

import { IconButton, List, ScrollBar } from "@fustilio/pixi-react-stack/ui";
import { ViewportDemoTwo } from "./ViewportDemoTwo";
import { ScrollBoxDemo } from "./ScrollBoxDemo";
import { Save } from "lucide";

export function ComponentsDemo() {
  const { app } = useApplication();
  const { width, height } = app.screen;

  // Demo state
  const [selectedDemo, setSelectedDemo] = useState<
    "list" | "scrollbox" | "scrollbar" | "viewport" | "icon-button"
  >("list");
  const [scrollBarH, setScrollBarH] = useState(0.25);
  const [scrollBarV, setScrollBarV] = useState(0.6);

  // Create demo containers for List and ScrollBox - make them stable
  const demoContainers = useMemo(() => {
    const containers: Container[] = [];

    for (let i = 0; i < 8; i++) {
      const container = new Container();
      const graphics = new Graphics();

      // Create different colored rectangles
      const colors = [
        0x3498db, 0xe74c3c, 0x2ecc71, 0xf39c12, 0x9b59b6, 0x1abc9c, 0xe67e22,
        0x34495e,
      ];
      const color = colors[i % colors.length];

      const rectWidth = 80 + Math.random() * 40;
      const rectHeight = 60 + Math.random() * 30;

      graphics
        .clear()
        .rect(0, 0, rectWidth, rectHeight)
        .fill(color)
        .stroke({ width: 2, color: 0xffffff });

      container.addChild(graphics);
      container.width = rectWidth;
      container.height = rectHeight;

      console.log(
        "🔧 Demo: Created container",
        i,
        "with dimensions:",
        rectWidth,
        "x",
        rectHeight
      );

      containers.push(container);
    }

    console.log("🔧 Demo: Created", containers.length, "demo containers");
    return containers;
  }, []); // Empty dependency array to make containers stable

  // Create separate demo containers for the second List to avoid sharing issues
  const demoContainers2 = useMemo(() => {
    const containers: Container[] = [];

    for (let i = 0; i < 8; i++) {
      const container = new Container();
      const graphics = new Graphics();

      // Create different colored rectangles
      const colors = [
        0x3498db, 0xe74c3c, 0x2ecc71, 0xf39c12, 0x9b59b6, 0x1abc9c, 0xe67e22,
        0x34495e,
      ];
      const color = colors[i % colors.length];

      const rectWidth = 80 + Math.random() * 40;
      const rectHeight = 60 + Math.random() * 30;

      graphics
        .clear()
        .rect(0, 0, rectWidth, rectHeight)
        .fill(color)
        .stroke({ width: 2, color: 0xffffff });

      container.addChild(graphics);
      container.width = rectWidth;
      container.height = rectHeight;

      console.log(
        "🔧 Demo: Created container2",
        i,
        "with dimensions:",
        rectWidth,
        "x",
        rectHeight
      );

      containers.push(container);
    }

    console.log("🔧 Demo: Created", containers.length, "demo containers2");
    return containers;
  }, []); // Empty dependency array to make containers stable

  // Event handlers
  const handleChildrenArranged = useCallback((children: Container[]) => {
    console.log("📋 List arranged children:", children.length);
  }, []);

  return (
    <pixiContainer width={width} height={height}>
      {/* Header */}
      <pixiGraphics
        draw={(g) => {
          g.clear()
            .rect(0, 0, width, 60)
            .fill(0x2c3e50)
            .stroke({ width: 2, color: 0x34495e });
        }}
      />

      <pixiText
        text="Pixi React UI Components Demo"
        x={width / 2}
        y={30}
        anchor={0.5}
        style={{
          fill: 0xffffff,
          fontSize: 24,
          fontFamily: "Arial",
          fontWeight: "bold",
        }}
      />

      {/* Demo selector buttons */}
      <pixiContainer x={20} y={70}>
        {(
          ["list", "scrollbox", "scrollbar", "viewport", "icon-button"] as const
        ).map((demo, index) => (
          <pixiContainer key={demo} x={index * 120} y={0}>
            <pixiGraphics
              draw={(g) => {
                g.clear()
                  .roundRect(0, 0, 100, 40, 8)
                  .fill(selectedDemo === demo ? 0x3498db : 0x95a5a6)
                  .stroke({ width: 2, color: 0xffffff });
              }}
              interactive={true}
              onPointerDown={() => setSelectedDemo(demo)}
            />
            <pixiText
              text={demo.charAt(0).toUpperCase() + demo.slice(1)}
              x={50}
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
        ))}
      </pixiContainer>

      {/* Demo content area */}
      <pixiContainer x={20} y={140}>
        {selectedDemo === "list" && (
          <pixiContainer>
            {/* List Demo */}
            <pixiText
              text="List Component - Bidirectional Layout"
              x={0}
              y={-20}
              style={{
                fill: 0xffffff,
                fontSize: 18,
                fontFamily: "Arial",
                fontWeight: "bold",
              }}
            />

            <pixiContainer x={0} y={20}>
              <List
                type="bidirectional"
                elementsMargin={15}
                padding={20}
                maxWidth={400}
                width={400}
                height={200}
                items={demoContainers}
                onChildrenArranged={handleChildrenArranged}
              />
            </pixiContainer>

            <pixiText
              text="List Component - Vertical Layout"
              x={0}
              y={240}
              style={{
                fill: 0xffffff,
                fontSize: 18,
                fontFamily: "Arial",
                fontWeight: "bold",
              }}
            />

            <pixiContainer x={0} y={280}>
              <List
                type="vertical"
                elementsMargin={10}
                padding={15}
                maxWidth={350}
                width={350}
                height={150}
                items={demoContainers2}
                onChildrenArranged={handleChildrenArranged}
              />
            </pixiContainer>
          </pixiContainer>
        )}

        {selectedDemo === "scrollbox" && <ScrollBoxDemo />}

        {selectedDemo === "scrollbar" && (
          <pixiContainer>
            <pixiText
              text="ScrollBar Component - Horizontal and Vertical"
              x={0}
              y={-20}
              style={{
                fill: 0xffffff,
                fontSize: 18,
                fontFamily: "Arial",
                fontWeight: "bold",
              }}
            />

            {/* Horizontal ScrollBar demo */}
            <pixiContainer x={0} y={20}>
              <ScrollBar
                orientation="horizontal"
                length={400}
                thickness={14}
                buttonSize={20}
                thumbSize={60}
                value={scrollBarH}
                onDecrement={() => setScrollBarH((v) => Math.max(0, v - 0.05))}
                onIncrement={() => setScrollBarH((v) => Math.min(1, v + 0.05))}
                onPageDecrement={() =>
                  setScrollBarH((v) => Math.max(0, v - 0.2))
                }
                onPageIncrement={() =>
                  setScrollBarH((v) => Math.min(1, v + 0.2))
                }
                onChange={(v) => setScrollBarH(v)}
                onChangeEnd={(v) => setScrollBarH(v)}
              />
            </pixiContainer>

            {/* Vertical ScrollBar demo */}
            <pixiContainer x={420} y={20}>
              <ScrollBar
                orientation="vertical"
                length={160}
                thickness={14}
                buttonSize={20}
                thumbSize={50}
                value={scrollBarV}
                onDecrement={() => setScrollBarV((v) => Math.max(0, v - 0.05))}
                onIncrement={() => setScrollBarV((v) => Math.min(1, v + 0.05))}
                onPageDecrement={() =>
                  setScrollBarV((v) => Math.max(0, v - 0.2))
                }
                onPageIncrement={() =>
                  setScrollBarV((v) => Math.min(1, v + 0.2))
                }
                onChange={(v) => setScrollBarV(v)}
                onChangeEnd={(v) => setScrollBarV(v)}
              />
            </pixiContainer>
          </pixiContainer>
        )}

        {selectedDemo === "viewport" && <ViewportDemoTwo />}
        {selectedDemo === "icon-button" && (
          <pixiContainer>
            <pixiText
              text="IconButton Component - Placeholder Demo"
              x={0}
              y={-20}
              style={{
                fill: 0xffffff,
                fontSize: 18,
                fontFamily: "Arial",
                fontWeight: "bold",
              }}
            />
            <IconButton icon={Save} />
          </pixiContainer>
        )}
      </pixiContainer>

      {/* Footer info */}
      <pixiText
        text="Use the buttons above to switch between demos."
        x={width / 2}
        y={height - 30}
        anchor={0.5}
        style={{
          fill: 0x95a5a6,
          fontSize: 12,
          fontFamily: "Arial",
        }}
      />
    </pixiContainer>
  );
}
