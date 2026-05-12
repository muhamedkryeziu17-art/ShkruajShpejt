import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { useTheme } from "../hooks/use-theme";

export function AnimatedGradient() {
  const { theme, reducedMotion } = useTheme();
  const drift = useSharedValue(0);

  useEffect(() => {
    drift.value = reducedMotion ? 0 : withRepeat(withTiming(1, { duration: 9000 }), -1, true);
  }, [drift, reducedMotion]);

  const firstOrbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: drift.value * 36 },
      { translateY: drift.value * 22 },
      { scale: 1 + drift.value * 0.08 }
    ]
  }));

  const secondOrbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -drift.value * 28 },
      { translateY: drift.value * 32 },
      { scale: 1.05 - drift.value * 0.06 }
    ]
  }));

  return (
    <>
      <LinearGradient
        colors={theme.mode === "dark" ? ["#07111f", "#101b2d", "#111827"] : ["#f8fbff", "#eaf2ff", "#ffffff"]}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.orb, styles.orbOne, { backgroundColor: theme.violet }, firstOrbStyle]} />
      <Animated.View style={[styles.orb, styles.orbTwo, { backgroundColor: theme.cyan }, secondOrbStyle]} />
      <Animated.View style={[styles.orb, styles.orbThree, { backgroundColor: theme.emerald }, firstOrbStyle]} />
    </>
  );
}

const styles = StyleSheet.create({
  orb: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 220,
    opacity: 0.16
  },
  orbOne: {
    top: -48,
    right: -84
  },
  orbTwo: {
    top: 210,
    left: -110
  },
  orbThree: {
    bottom: -120,
    right: 24
  }
});
