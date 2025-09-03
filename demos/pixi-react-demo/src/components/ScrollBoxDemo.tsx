import { ScrollBox } from "@fustilio/pixi-react-stack/ui";

export function ScrollBoxDemo() {
  return (
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
          <layoutContainer
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
                {["88", "99", "aa", "bb", "cc", "dd", "ee", "ff"].map((i) => (
                  <layoutView
                    key={i}
                    layout={{
                      width: 50,
                      height: 50,
                      backgroundColor: `#00${i}00aa`,
                    }}
                  />
                ))}
              </layoutContainer>
            </ScrollBox>
          </layoutContainer>
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
  );
}
