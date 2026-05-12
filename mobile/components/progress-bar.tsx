import { StyleSheet, View, type DimensionValue } from "react-native";
import { useTheme } from "../hooks/use-theme";

type ProgressBarProps = {
  value: number;
};

export function ProgressBar({ value }: ProgressBarProps) {
  const { theme } = useTheme();
  const width = `${Math.min(Math.max(value, 0), 100)}%` as DimensionValue;
  return (
    <View style={[styles.track, { backgroundColor: theme.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)" }]}>
      <View style={[styles.fill, { width, backgroundColor: theme.primary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 9,
    borderRadius: 99,
    overflow: "hidden"
  },
  fill: {
    height: "100%",
    borderRadius: 99
  }
});
