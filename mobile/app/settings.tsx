import { Linking, StyleSheet, Switch, View } from "react-native";
import Constants from "expo-constants";
import { AppText } from "../components/app-text";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { Screen } from "../components/screen";
import { legalUrls } from "../constants/legal";
import { useAuth } from "../hooks/use-auth";
import { useTheme } from "../hooks/use-theme";

export default function SettingsScreen() {
  const {
    theme,
    themeMode,
    soundEnabled,
    hapticsEnabled,
    reducedMotion,
    setThemeMode,
    setSoundEnabled,
    setHapticsEnabled,
    setReducedMotion
  } = useTheme();
  const { session, signOut } = useAuth();
  const version = Constants.expoConfig?.version || "1.0.0";

  return (
    <Screen>
      <AppText variant="title">Cilesimet</AppText>
      <Card>
        <SettingRow label="Modaliteti i erret" value={themeMode === "dark"} onValueChange={(value) => setThemeMode(value ? "dark" : "light")} />
        <SettingRow label="Zeri" value={soundEnabled} onValueChange={setSoundEnabled} />
        <SettingRow label="Dridhje" value={hapticsEnabled} onValueChange={setHapticsEnabled} />
        <SettingRow label="Levizje te reduktuara" value={reducedMotion} onValueChange={setReducedMotion} />
      </Card>

      <Card>
        <Button variant="secondary" onPress={() => Linking.openURL(legalUrls.privacy)}>Politika e Privatesise</Button>
        <Button variant="secondary" onPress={() => Linking.openURL(legalUrls.terms)}>Kushtet e Sherbimit</Button>
        <Button variant="secondary" onPress={() => Linking.openURL(legalUrls.refund)}>Politika e Rimbursimit</Button>
        <Button variant="secondary" onPress={() => Linking.openURL(legalUrls.contact)}>Kontakt</Button>
        <Button variant="secondary" onPress={() => Linking.openURL(legalUrls.deleteAccount)}>Fshirja e Llogarise</Button>
        {session ? <Button variant="danger" onPress={signOut}>Dil nga llogaria</Button> : null}
        <AppText variant="caption" muted>Versioni {version}</AppText>
        <AppText variant="caption" selectable style={{ color: theme.warning }}>
          Per Vercel falas, zevendeso YOUR_DOMAIN me shkruajshpejt.vercel.app.
        </AppText>
      </Card>
    </Screen>
  );
}

function SettingRow({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (value: boolean) => void }) {
  const { theme } = useTheme();
  return (
    <View style={styles.row}>
      <AppText variant="body">{label}</AppText>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.border, true: `${theme.primary}88` }}
        thumbColor={value ? theme.primary : theme.textMuted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  }
});
