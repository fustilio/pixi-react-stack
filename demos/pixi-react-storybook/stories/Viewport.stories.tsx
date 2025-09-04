import { fn } from "storybook/test";

import { ScrollBox, Viewport } from "@fustilio/pixi-react-stack/ui";
import { Save } from "lucide";
import { withCheckerboard } from "./helpers/withCheckerboard";
import { withApplication } from "./helpers/withApplication";
import React from "react";
import { ViewportDemo } from "./ViewportDemo";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "UI/Viewport",
  component: Viewport,
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
   (Story) => <ViewportDemo />,
   withApplication({ width: 1000, height: 1000 }),
  ],
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
  }
};
