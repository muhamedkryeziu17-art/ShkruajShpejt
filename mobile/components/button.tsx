import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { AppText } from "./app-text";
import { useTheme } from "../hooks/use-theme";

type ButtonProps = {
  children: ReactNode;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  disabled?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({ children, onPress, variant = "primary", disabled }: ButtonProps) {
  const { theme, reducedMotion } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const backgroundColor =
    variant === "primary"
      ? theme.primary
      : variant === "danger"
        ? theme.rose
        : variant === "ghost"
          ? "transparent"
          : theme.mode === "dark"
            ? "rgba(255,255,255,0.07)"
            : "rgba(15,23,42,0.05)";

  const textColor = variant === "primary" ? theme.primaryText : variant === "danger" ? "#fff" : theme.text;

  return (
    <AnimatedPressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => {
        scale.value = reducedMotion ? 1 : withSpring(0.97);
      }}
      onPressOut={() => {
        scale.value = reducedMotion ? 1 : withSpring(1);
      }}
      style={[
        styles.button,
        { backgroundColor, borderColor: theme.border, opacity: disabled ? 0.5 : 1 },
        animatedStyle
      ]}
    >
      <View style={styles.inner}>
        <AppText variant="label" style={{ color: textColor }}>
          {children}
        </AppText>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    justifyContent: "center"
  },
  inner: {
    alignItems: "center",
    justifyContent: "center"
  }
});
