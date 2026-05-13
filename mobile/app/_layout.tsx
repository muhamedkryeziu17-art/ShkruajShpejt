import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TermsAcceptanceGate } from "../components/terms-acceptance-gate";
import { AuthProvider } from "../hooks/use-auth";
import { LegalAcceptanceProvider } from "../hooks/use-legal-acceptance";
import { SettingsProvider, useTheme } from "../hooks/use-theme";
import { TestResultProvider } from "../hooks/use-test-result";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SettingsProvider>
        <AuthProvider>
          <LegalAcceptanceProvider>
            <TestResultProvider>
              <RootStack />
              <TermsAcceptanceGate />
            </TestResultProvider>
          </LegalAcceptanceProvider>
        </AuthProvider>
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}

function RootStack() {
  const { theme } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: theme.background }
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: "Hyr ne llogari" }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="test/result" options={{ title: "Rezultati" }} />
      <Stack.Screen name="lessons/[slug]" options={{ title: "Mesimi" }} />
      <Stack.Screen name="weak-keys" options={{ title: "Tastet e Dobeta" }} />
      <Stack.Screen name="bigrams" options={{ title: "Cifte Shkronjash" }} />
      <Stack.Screen name="settings" options={{ title: "Cilesimet" }} />
    </Stack>
  );
}
