import { CheckerboardView } from "@fustilio/pixi-react-stack/storybook";
import React from "react";

export function withCheckerboard(options: {
  width: number;
  height: number;
  grids: number;
}) {
  return (Story) => (
    <CheckerboardView
      grids={options.grids}
      width={options.width}
      height={options.height}
    >
      <Story />
    </CheckerboardView>
  );
}
