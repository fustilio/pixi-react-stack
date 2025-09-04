import {
  CheckerboardView,
  Wrapper,
} from "@fustilio/pixi-react-stack/storybook";
import React from "react";
import { Application } from "@pixi/react";

export function withApplication(options: { width: number; height: number }) {
  return (Story) => (
    <Application
      width={options.width}
      height={options.height}
      // backgroundColor={"#ff000033"}
      // resizeTo={window}
      autoStart={true}
      // resolution={window.devicePixelRatio * 2}
    >
      <Wrapper>
        <Story />
      </Wrapper>
    </Application>
  );
}
