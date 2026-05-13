import { useState } from "react";
import { Linking, Modal, StyleSheet, View } from "react-native";
import { ShieldCheck } from "lucide-react-native";
import { AppText } from "./app-text";
import { Button } from "./button";
import { Card } from "./card";
import { TERMS_VERSION, PRIVACY_VERSION, legalUrls } from "../constants/legal";
import { useAuth } from "../hooks/use-auth";
import { useLegalAcceptance } from "../hooks/use-legal-acceptance";
import { useTheme } from "../hooks/use-theme";

export function TermsAcceptanceGate() {
  const { signOut } = useAuth();
  const { theme } = useTheme();
  const { loading, accepting, error, mustAcceptTerms, refresh, acceptLatestTerms } = useLegalAcceptance();
  const [checked, setChecked] = useState(false);

  if (!loading && !mustAcceptTerms && !error) {
    return null;
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={() => undefined}>
      <View style={styles.backdrop}>
        <Card style={styles.card}>
          {loading ? (
            <AppText variant="body">Duke kontrolluar kushtet...</AppText>
          ) : error && !mustAcceptTerms ? (
            <>
              <AppText variant="subtitle">Kushtet nuk u verifikuan</AppText>
              <AppText variant="body" muted>{error}</AppText>
              <View style={styles.actions}>
                <Button onPress={refresh}>Provo perseri</Button>
                <Button variant="secondary" onPress={signOut}>Dil nga llogaria</Button>
              </View>
            </>
          ) : (
            <>
              <View style={styles.header}>
                <View style={[styles.icon, { backgroundColor: `${theme.primary}22` }]}>
                  <ShieldCheck color={theme.primary} size={24} />
                </View>
                <View style={styles.headerText}>
                  <AppText variant="caption" muted>Versioni {TERMS_VERSION}</AppText>
                  <AppText variant="subtitle">Kushtet dhe Rregullat</AppText>
                </View>
              </View>

              <AppText variant="body" muted>
                Per te vazhduar, duhet te pranosh Kushtet dhe Rregullat dhe Politiken e Privatise.
              </AppText>

              <View style={styles.links}>
                <Button variant="secondary" onPress={() => Linking.openURL(legalUrls.terms)}>Lexo Kushtet</Button>
                <Button variant="secondary" onPress={() => Linking.openURL(legalUrls.privacy)}>Lexo Politiken e Privatise</Button>
              </View>

              <Button variant={checked ? "secondary" : "ghost"} onPress={() => setChecked((value) => !value)}>
                {checked ? "Pranuar" : "Pranoj Kushtet dhe Rregullat dhe Politiken e Privatise."}
              </Button>
              <AppText variant="caption" muted>Kushtet: {TERMS_VERSION} / Privatesia: {PRIVACY_VERSION}</AppText>

              {error ? <AppText variant="caption" style={{ color: theme.rose }}>{error}</AppText> : null}

              <View style={styles.actions}>
                <Button onPress={acceptLatestTerms} disabled={!checked || accepting}>
                  {accepting ? "Duke ruajtur..." : "Pranoj dhe vazhdo"}
                </Button>
                <Button variant="secondary" onPress={signOut}>Dil nga llogaria</Button>
              </View>
            </>
          )}
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    padding: 18,
    backgroundColor: "rgba(2, 6, 23, 0.76)"
  },
  card: {
    gap: 16
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  headerText: {
    flex: 1,
    gap: 3
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center"
  },
  links: {
    gap: 10
  },
  actions: {
    gap: 10
  }
});
