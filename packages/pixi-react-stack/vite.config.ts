import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [react(),
     dts({
      entryRoot: "src",
      outputDir: "dist/types",
      tsConfigFilePath: path.resolve(__dirname, "tsconfig.json"),
    }),
  ],
  build: {
    // Generate source maps for debugging
    sourcemap: true,
    lib: {
      // Define multiple entry points for `ui` and `layout`
      entry: {
        index: path.resolve(__dirname, "src/index.ts"),
        ui: path.resolve(__dirname, "src/components/ui/index.ts"),
        layout: path.resolve(__dirname, "src/components/layout/index.ts"),
      },
      name: "PixiReactStack",
      fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "@pixi/react",
        "pixi.js",
        "pixi-viewport",
        "@pixi/layout",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@pixi/react": "PixiReact",
          "pixi.js": "PIXI",
          "pixi-viewport": "PixiViewport",
          "@pixi/layout": "PixiLayout",
        },
      },
    },
  },
});
