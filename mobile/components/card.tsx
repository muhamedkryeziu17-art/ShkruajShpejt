import type { ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { useTheme } from "../hooks/use-theme";

type CardProps = {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
};

export function Card({ children, style }: CardProps) {
  const { theme } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 26,
    padding: 16,
    gap: 12,
    overflow: "hidden"
  }
});
