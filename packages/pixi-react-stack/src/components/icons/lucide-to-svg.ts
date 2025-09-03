import type { IconNode, SVGProps } from "lucide";

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
};

export default defaultAttributes;
export function lucideToSvg(
  icon: IconNode,
  attributes: SVGProps = defaultAttributes,
) {
  // console.log("debug", icon, attributes);
  return `<svg ${Object.entries(attributes)
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ")}>${icon
    .map(([tag, attrs]) => {
      const attrString = Object.entries(
        tag === "path" || tag === "circle" || tag === "line"
          ? { ...attrs, stroke: "#ffffff", "stroke-width": 2 }
          : attrs,
      )
        .map(([k, v]) => `${k}="${v}"`)
        .join(" ");
      return `<${tag} ${attrString} />`;
    })
    .join("\n")}</svg>`;
}
