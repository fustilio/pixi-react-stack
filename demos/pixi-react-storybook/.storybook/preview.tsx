import { Application } from "@pixi/react";

import React from "react";
import {
  CheckerboardView,
  Wrapper,
} from "@fustilio/pixi-react-stack/storybook";
import { withApplication } from "../stories/helpers/withApplication";

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

};

export default preview;
