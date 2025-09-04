import { Application } from "@pixi/react";

import { LayoutResizer } from "@fustilio/pixi-react-stack/layout";
import React from "react";

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  decorators: [
    (Story) => {
      return (
        <Application
          backgroundColor={"white"}
          // resizeTo={window}
          autoStart={true}
          resolution={window.devicePixelRatio * 2}
        >
          <LayoutResizer>
            {(dimensions: { width: number; height: number }) => {
              return <Story />;
            }}
          </LayoutResizer>
        </Application>
      );
    },
  ],
};

export default preview;
