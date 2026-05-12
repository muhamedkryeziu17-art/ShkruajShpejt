import { Tabs } from "expo-router";
import { BarChart3, BookOpen, Home, Keyboard, User } from "lucide-react-native";
import { useTheme } from "../../hooks/use-theme";

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.mode === "dark" ? "#081321" : "#ffffff",
          borderTopColor: theme.border,
          height: 76,
          paddingTop: 8
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "800"
        }
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Ballina", tabBarIcon: ({ color }) => <Home color={color} size={20} /> }} />
      <Tabs.Screen name="test" options={{ title: "Testi", tabBarIcon: ({ color }) => <Keyboard color={color} size={20} /> }} />
      <Tabs.Screen name="lessons" options={{ title: "Mesimet", tabBarIcon: ({ color }) => <BookOpen color={color} size={20} /> }} />
      <Tabs.Screen name="stats" options={{ title: "Statistikat", tabBarIcon: ({ color }) => <BarChart3 color={color} size={20} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Profili", tabBarIcon: ({ color }) => <User color={color} size={20} /> }} />
    </Tabs>
  );
}
