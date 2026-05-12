import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { AppText } from "../components/app-text";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { Screen } from "../components/screen";
import { useAuth } from "../hooks/use-auth";
import { useTheme } from "../hooks/use-theme";

export default function LoginScreen() {
  const { signInWithGoogle, continueAsGuest, isConfigured } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogle() {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle();
      router.replace("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hyrja me Google deshtoi");
    } finally {
      setLoading(false);
    }
  }

  function handleGuest() {
    continueAsGuest();
    router.replace("/home");
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="title">ShkruajShpejt</AppText>
        <AppText variant="body" muted>
          Teste, mesime dhe statistika per te rritur shpejtesine dhe saktesine.
        </AppText>
      </View>

      <Card>
        <AppText variant="subtitle">Hyr ne llogari</AppText>
        <AppText variant="body" muted>
          Ruaj rezultatet, mesimet dhe statistikat me Supabase Auth.
        </AppText>
        {!isConfigured ? (
          <AppText variant="caption" style={{ color: theme.warning }}>
            Konfigurimi i Supabase mungon
          </AppText>
        ) : null}
        {error ? (
          <AppText variant="caption" selectable style={{ color: theme.rose }}>
            {error}
          </AppText>
        ) : null}
        <Button onPress={handleGoogle} disabled={loading || !isConfigured}>
          {loading ? "Duke hapur..." : "Kycu me Google"}
        </Button>
        <Button variant="secondary" onPress={handleGuest}>
          Vazhdo si mysafir
        </Button>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: 10,
    paddingTop: 28,
    paddingBottom: 8
  }
});
