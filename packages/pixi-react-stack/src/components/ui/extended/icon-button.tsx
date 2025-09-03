import { type IconNode } from "lucide";

import { lucideToSvg } from "../../icons/lucide-to-svg";
import { Button } from "../Button";

export type IconButtonProps = {
  icon?: IconNode;
  text?: string;
  onPress?: () => void;
  disabled?: boolean;
  width?: number;
  height?: number;
  backgroundColor?: number;
  textColor?: number;
};

export function IconButton({
  icon,
  text,
  onPress,
  disabled = false,
  width = 48,
  height = 32,
  backgroundColor = 0x34495e,
  textColor = 0xffffff,
}: IconButtonProps) {
  return (
    <Button
      style={{
        backgroundColor: disabled ? 0x7f8c8d : backgroundColor,
        width,
        height,
      }}
      onPress={onPress}
      disabled={disabled}
    >
      <layoutContainer
        layout={{
          width,
          height,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
        }}
      >
        <layoutContainer
          layout={{
            width: icon ? 24 : 0,
            height: "100%",
          }}
        >
          {icon && (
            <pixiGraphics
              y={3}
              draw={(g) => {
                g.clear();
                g.svg(lucideToSvg(icon));
              }}
            />
          )}
        </layoutContainer>
        <layoutContainer
          layout={{
            width: text ? text.length * 6 : 0,
            height: 12,
          }}
        >
          {text && (
            <pixiText
              text={text}
              x={0}
              y={0}
              style={{
                fill: disabled ? 0x95a5a6 : textColor,
                fontSize: 10,
                fontFamily: "Arial",
                fontWeight: "bold",
              }}
            />
          )}
        </layoutContainer>
      </layoutContainer>
    </Button>
  );
}
