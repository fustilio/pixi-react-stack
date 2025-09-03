import { useCallback, useMemo, useState } from "react";
import { useApplication } from "@pixi/react";
import { Container, Graphics } from "pixi.js";

import { List, ScrollBox, ScrollBar } from "../components/ui";
import { ViewportDemoTwo } from "./ViewportDemoTwo";

export function ComponentsDemo() {
  const { app } = useApplication();
  const { width, height } = app.screen;

  // Demo state
  const [selectedDemo, setSelectedDemo] = useState<
    "list" | "scrollbox" | "scrollbar" | "viewport"
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
        {(["list", "scrollbox", "scrollbar", "viewport"] as const).map(
          (demo, index) => (
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
          )
        )}
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

        {selectedDemo === "scrollbox" && (
          <pixiContainer>
            {/* ScrollBox Demo */}
            <pixiText
              text="ScrollBox Component - Horizontal Scrolling"
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
              <layoutContainer
                layout={{
                  width: 600,
                  height: 300,
                  backgroundColor: 0x34495e,
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <layoutView
                  layout={{
                    width: 500,
                    height: 200,
                    backgroundColor: "green",
                  }}
                >
                  <ScrollBox
                    width={500}
                    height={200}
                    worldWidth={1000}
                    worldHeight={180}
                    // onScroll={handleScroll}
                  >
                    {/* <List items={demoContainers3} type="horizontal" ></List> */}
                    <layoutContainer
                      layout={{
                        width: 1000,
                        height: 180,
                        backgroundColor: "ff0000aa",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: 20,
                      }}
                    >
                      {["88", "99", "aa", "bb", "cc", "dd", "ee", "ff"].map(
                        (i) => (
                          <layoutView
                            key={i}
                            layout={{
                              width: 50,
                              height: 50,
                              backgroundColor: `#00${i}00aa`,
                            }}
                          ></layoutView>
                        )
                      )}
                    </layoutContainer>
                  </ScrollBox>
                </layoutView>
              </layoutContainer>
            </pixiContainer>

            {/* <pixiText
              text="ScrollBox Component - Bidirectional Scrolling"
              x={0}
              y={250}
              style={{
                fill: 0xffffff,
                fontSize: 18,
                fontFamily: "Arial",
                fontWeight: "bold",
              }}
            /> */}

            <pixiContainer x={0} y={290}>
              {/* <ScrollBox
                width={400}
                height={300}
                type="bidirectional"
                background={0x2c3e50}
                radius={10}
                items={demoContainers4}
                onScroll={handleScroll}
                elementsMargin={15}
                padding={20}
              /> */}
            </pixiContainer>
          </pixiContainer>
        )}

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
