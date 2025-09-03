import { Camera, ZoomOut } from "lucide";
import { describe, expect, it } from "vitest";

import { lucideToSvg } from "./lucide-to-svg";

describe("lucide to svg", () => {
  it("should convert lucide to svg basic", () => {
    const svg = lucideToSvg(Camera);

    expect(svg)
      .toContain(`<svg xmlns="http://www.w3.org/2000/svg"><path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z" />
<circle cx="12" cy="13" r="3" /></svg>`);
  });

  
  it.only("should convert lucide to svg basic with attributes", () => {
    const svg = lucideToSvg(ZoomOut);

    expect(svg)
      .toContain(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-icon lucide-move" data-v-6433c584=""><path d="M12 2v20"></path><path d="m15 19-3 3-3-3"></path><path d="m19 9 3 3-3 3"></path><path d="M2 12h20"></path><path d="m5 9-3 3 3 3"></path><path d="m9 5 3-3 3 3"></path></svg>`);
  });
});
