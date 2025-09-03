import { AbstractText, Text } from 'pixi.js';
import type { AnyTextStyle, AnyTextStyleOptions } from 'pixi.js';

export type PixiText = AbstractText;
export type AnyText = string | number | PixiText;
export type PixiTextClass = new ({
    text,
    style,
}: {
    text: string;
    style?: PixiTextStyle;
    [x: string]: unknown;
}) => PixiText;
export type PixiTextStyle = AnyTextStyle | Partial<AnyTextStyleOptions>;

export function getTextView(text: AnyText): PixiText
{
    if (typeof text === 'string' || typeof text === 'number')
    {
        return new Text({ text: String(text) });
    }

    return text;
}