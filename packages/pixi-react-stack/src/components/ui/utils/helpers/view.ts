import { Container, Graphics, Sprite, Texture } from 'pixi.js';

export type GetViewSettings = string | Texture | Container | Sprite | Graphics;

export function getView(view: GetViewSettings): Container | Sprite | Graphics
{
    if (typeof view === 'string')
    {
        return Sprite.from(view);
    }

    if (view instanceof Texture)
    {
        return new Sprite(view);
    }

    console.log("what is the view", view);

    return view;
}