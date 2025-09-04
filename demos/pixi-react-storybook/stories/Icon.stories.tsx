import { fn } from "storybook/test";

import { Icon } from "@fustilio/pixi-react-stack/ui";
import { Save, Triangle } from "lucide";
import { withCheckerboard } from "./helpers/withCheckerboard";
import { withApplication } from "./helpers/withApplication";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "UI/Icon",
  component: Icon,
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
    withCheckerboard({
      width: 64,
      height: 64,
      grids: 32,
      darkColor: "black",
      lightColor: "gray",
    }),
    withApplication({ width: 64, height: 64 }),
  ],
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const SaveIcon = {
  args: {
    icon: Save,
    size: 24,
    color: "white",
  },
};

export const TriangleIcon = {
  args: {
    icon: Triangle,
    size: 24,
    color: "white",
  },
};

export const RotatedTriangleIcon = {
  args: {
    icon: Triangle,
    size: 24,
    color: "white",
    rotation: Math.PI / 2,
  },
};

export const SmallIcon = {
  args: {
    icon: Triangle,
    size: 12,
    color: "white",
  },
};

export const BigIcon = {
  args: {
    icon: Triangle,
    size: 64,
    color: "white",
  },
};
