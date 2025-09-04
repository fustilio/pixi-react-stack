import { fn } from "storybook/test";

import { ScrollBar } from "@fustilio/pixi-react-stack/ui";
import { Save } from "lucide";
import { withCheckerboard } from "./helpers/withCheckerboard";
import { withApplication } from "./helpers/withApplication";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "UI/ScrollBar",
  component: ScrollBar,
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
    withCheckerboard({ width: 512, height: 512, grids: 32 }),
    withApplication({ width: 512, height: 512 }),
  ],
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    length: 400,
    thickness: 14,
    buttonSize: 20,
    thumbSize: 60,
    value: 0,
    onDecrement: () => {},
    onIncrement: () => {},
    trackColor: "#ffffff",
    trackAlpha:1,
    thumbColor: "black",
    thumbAlpha:1,
  },
};


{/* <ScrollBar
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
              /> */}