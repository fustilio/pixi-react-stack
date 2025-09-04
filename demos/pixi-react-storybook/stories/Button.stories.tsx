import { fn } from "storybook/test";

import { IconButton } from "@fustilio/pixi-react-stack/ui";
import { Save } from "lucide";
import { withCheckerboard } from "./helpers/withCheckerboard";
import { withApplication } from "./helpers/withApplication";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "UI/Button",
  component: IconButton,
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
    withCheckerboard({ width: 256, height: 256, grids: 12 }),
    withApplication({ width: 256, height: 256 }),
  ],
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    icon: Save,
    text: "Save",
    // primary: true,
    // label: 'Button',
  },
};
