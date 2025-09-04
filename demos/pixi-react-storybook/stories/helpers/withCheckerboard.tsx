import {
  CheckerboardView,
  CheckerboardViewProps,
} from "@fustilio/pixi-react-stack/storybook";
import React from "react";

export function withCheckerboard(options: CheckerboardViewProps) {
  return (Story) => (
    <CheckerboardView
      {...options}
    >
      <Story />
    </CheckerboardView>
  );
}
