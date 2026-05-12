import { StyleSheet, View } from "react-native";
import { Link, router } from "expo-router";
import { AppText } from "../../components/app-text";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { Screen } from "../../components/screen";
import { useAuth } from "../../hooks/use-auth";
import { useTheme } from "../../hooks/use-theme";

export default function ProfileScreen() {
  const { user, session, isGuest, signOut } = useAuth();
  const { theme } = useTheme();
  const name = (user?.user_metadata?.full_name as string | undefined) || user?.email?.split("@")[0] || "mysafir";

  async function logout() {
    await signOut();
    router.replace("/login");
  }

  return (
    <Screen>
      <AppText variant="title">Profili</AppText>
      <Card>
        <View style={[styles.avatar, { backgroundColor: `${theme.primary}22`, borderColor: theme.border }]}>
          <AppText variant="metric">{name.slice(0, 1).toUpperCase()}</AppText>
        </View>
        <AppText variant="subtitle">{name}</AppText>
        <AppText variant="body" muted>{session ? user?.email : isGuest ? "Menyra mysafir" : "Nuk je i kycur"}</AppText>
        {session ? (
          <Button variant="danger" onPress={logout}>Dil nga llogaria</Button>
        ) : (
          <Link href="/login" asChild><Button>Kycu me Google</Button></Link>
        )}
      </Card>
      <Link href="/settings" asChild><Button variant="secondary">Cilesimet</Button></Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
