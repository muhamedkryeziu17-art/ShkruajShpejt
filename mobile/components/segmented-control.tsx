import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "./app-text";
import { useTheme } from "../hooks/use-theme";

type SegmentedControlProps<T extends string> = {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({ label, value, options, onChange }: SegmentedControlProps<T>) {
  const { theme } = useTheme();
  return (
    <View style={styles.wrap}>
      <AppText variant="label">{label}</AppText>
      <View style={styles.row}>
        {options.map((option) => {
          const active = option === value;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              style={[
                styles.item,
                {
                  borderColor: active ? theme.primary : theme.border,
                  backgroundColor: active ? `${theme.primary}22` : theme.card
                }
              ]}
            >
              <AppText variant="caption" style={{ color: active ? theme.primary : theme.textMuted }}>
                {option}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  item: {
    minHeight: 38,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    justifyContent: "center"
  }
});
