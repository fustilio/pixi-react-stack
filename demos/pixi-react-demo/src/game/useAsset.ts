import { Assets, Texture } from "pixi.js";
import { useState, useEffect } from "react";

export function useAsset(url: string): Texture {
  const [texture, setTexture] = useState<Texture>(Texture.EMPTY);

  useEffect(() => {
    let isMounted = true;
    setTexture(Texture.EMPTY);
    Assets.load(url)
      .then((loadedTexture: Texture) => {
        if (isMounted) {
          setTexture(loadedTexture);
        }
      })
      .catch(err => {
        console.error(`Failed to load texture: ${url}`, err);
      });
    return () => {
      isMounted = false;
    };
  }, [url]);

  return texture;
} 