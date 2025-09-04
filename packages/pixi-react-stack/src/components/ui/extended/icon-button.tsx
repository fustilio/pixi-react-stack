import { type IconNode } from "lucide";

import { lucideToSvg } from "../../icons/lucide-to-svg";
import { Button } from "../Button";
import { Icon, type IconProps } from "./icon";
import { COLORS } from "../colors";

export type IconButtonProps = {
  icon: IconNode;
  text?: string;
  onPress?: () => void;
  disabled?: boolean;
  width?: number;
  height?: number;
  backgroundColor?: number;
  textColor?: number;
  iconProps?: Omit<IconProps, "icon">;
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
  iconProps,
}: IconButtonProps) {
  if (text) {
    return (
      <Button
        style={{
          backgroundColor: disabled ? COLORS.GRAY[500] : backgroundColor,
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
              width: iconProps?.size ?? 24,
              height: iconProps?.size ?? 24,
            }}
          >
            <Icon icon={icon} {...iconProps} />
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
                  fill: disabled ? COLORS.GRAY[400] : textColor,
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
  return (
    <Button
      style={{
        backgroundColor: disabled ? COLORS.GRAY[500] : backgroundColor,
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
        }}
      >
        <layoutContainer
          layout={{
            width: iconProps?.size ?? 24,
            height: iconProps?.size ?? 24,
          }}
        >
          <Icon icon={icon} {...iconProps} />
        </layoutContainer>
      </layoutContainer>
    </Button>
  );
}
