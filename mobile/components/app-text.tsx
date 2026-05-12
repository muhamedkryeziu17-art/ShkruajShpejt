import type { ReactNode } from "react";
import { Text, type TextProps, type TextStyle } from "react-native";
import { useTheme } from "../hooks/use-theme";

type AppTextProps = TextProps & {
  children: ReactNode;
  variant?: "title" | "subtitle" | "body" | "caption" | "label" | "metric";
  muted?: boolean;
};

export function AppText({ children, variant = "body", muted, style, ...props }: AppTextProps) {
  const { theme } = useTheme();
  const base = {
    color: muted ? theme.textMuted : theme.text,
    letterSpacing: 0
  };

  const variants: Record<NonNullable<AppTextProps["variant"]>, TextStyle> = {
    title: { fontSize: 30, lineHeight: 36, fontWeight: "800" as const },
    subtitle: { fontSize: 18, lineHeight: 25, fontWeight: "700" as const },
    body: { fontSize: 15, lineHeight: 22, fontWeight: "500" as const },
    caption: { fontSize: 12, lineHeight: 17, fontWeight: "600" as const },
    label: { fontSize: 13, lineHeight: 18, fontWeight: "800" as const },
    metric: { fontSize: 28, lineHeight: 34, fontWeight: "900" as const, fontVariant: ["tabular-nums"] }
  };

  return (
    <Text {...props} style={[base, variants[variant], style]}>
      {children}
    </Text>
  );
}
