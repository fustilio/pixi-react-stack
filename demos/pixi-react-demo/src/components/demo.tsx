import { Application } from "@pixi/react";

import { LayoutResizer } from "@fustilio/pixi-react-stack/layout";

import { ComponentsDemo } from "./ComponentsDemo";

export function PixiReactDemo() {
  return (
    <Application background="#000022" resizeTo={window} autoStart={true}>
      <LayoutResizer>
        {(dimensions: { width: number; height: number }) => {
          return <ComponentsDemo />;
        }}
      </LayoutResizer>
    </Application>
  );
}
