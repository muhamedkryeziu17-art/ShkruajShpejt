import type { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInUp } from "react-native-reanimated";
import { AnimatedGradient } from "./animated-gradient";
import { useTheme } from "../hooks/use-theme";

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
};

export function Screen({ children, scroll = true }: ScreenProps) {
  const { theme, reducedMotion } = useTheme();
  const content = (
    <Animated.View entering={reducedMotion ? undefined : FadeInUp.duration(380)} style={styles.content}>
      {children}
    </Animated.View>
  );

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.mode === "dark" ? "light" : "dark"} />
      <AnimatedGradient />
      <SafeAreaView style={styles.safe}>
        {scroll ? (
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  safe: {
    flex: 1
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 110
  },
  content: {
    gap: 16
  }
});
