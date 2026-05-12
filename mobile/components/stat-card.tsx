import { StyleSheet, View } from "react-native";
import { AppText } from "./app-text";
import { Card } from "./card";
import { useTheme } from "../hooks/use-theme";

type StatCardProps = {
  label: string;
  value: string | number;
  accent?: "cyan" | "emerald" | "violet" | "rose" | "warning";
};

export function StatCard({ label, value, accent = "cyan" }: StatCardProps) {
  const { theme } = useTheme();
  const color = theme[accent];
  return (
    <Card style={styles.card}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <AppText variant="caption" muted>{label}</AppText>
      <AppText variant="metric">{value}</AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 145
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8
  }
});
