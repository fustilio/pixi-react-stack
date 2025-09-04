import { fn } from "storybook/test";

import { ScrollBox } from "@fustilio/pixi-react-stack/ui";
import { Save } from "lucide";
import { withCheckerboard } from "./helpers/withCheckerboard";
import { withApplication } from "./helpers/withApplication";
import React from "react";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "UI/ScrollBox",
  component: ScrollBox,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // argTypes: {
  //   backgroundColor: { control: 'color' },
  // },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
  decorators: [
    withCheckerboard({ width: 512, height: 200, grids: 32 }),
    withApplication({ width: 512, height: 200 }),
  ],
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    width: 512,
    height: 200,
    worldWidth: 1000,
    worldHeight: 200,
    children: (
      <layoutContainer
        layout={{
          width: 1000,
          height: 200,
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
    ),
  },
};
