import { Redirect } from "expo-router";
import { AppText } from "../components/app-text";
import { Screen } from "../components/screen";
import { useAuth } from "../hooks/use-auth";

export default function IndexRoute() {
  const { loading, session, isGuest } = useAuth();

  if (loading) {
    return (
      <Screen>
        <AppText variant="body">Po ngarkohet...</AppText>
      </Screen>
    );
  }

  return <Redirect href={session || isGuest ? "/home" : "/login"} />;
}
