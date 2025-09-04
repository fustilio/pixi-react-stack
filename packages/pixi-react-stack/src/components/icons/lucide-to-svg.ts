import type { IconNode, SVGProps } from "lucide";
import type { ColorSource } from "pixi.js";

export const defaultAttributes: SVGProps = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  //   stroke: 'currentColor',
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  // preserveAspectRatio: "xMidYMid meet",
};

export default defaultAttributes;
export function lucideToSvg(
  icon: IconNode,
  attributes?: SVGProps,
  color: ColorSource = "#ffffff"
) {
  const combinedAttributes = { ...defaultAttributes, ...attributes };

  const output =  `<svg ${Object.entries(combinedAttributes)
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ")}>${icon
    .map(([tag, attrs]) => {
      const attrString = Object.entries(
        tag === "path" || tag === "circle" || tag === "line"
          ? { ...attrs, stroke: color, "stroke-width": 2 }
          : attrs
      )
        .map(([k, v]) => `${k}="${v}"`)
        .join(" ");
      return `<${tag} ${attrString} />`;
    })
    .join("\n")}</svg>`;

  return output;
}
