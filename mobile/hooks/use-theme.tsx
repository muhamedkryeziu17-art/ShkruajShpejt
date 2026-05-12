import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Appearance } from "react-native";
import * as SecureStore from "expo-secure-store";
import { themes, type AppTheme, type ThemeMode } from "../constants/theme";

type SettingsContextValue = {
  themeMode: ThemeMode;
  theme: AppTheme;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  reducedMotion: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setSoundEnabled: (value: boolean) => void;
  setHapticsEnabled: (value: boolean) => void;
  setReducedMotion: (value: boolean) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

const settingsKey = "shkruajshpejt-settings";

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const systemMode = Appearance.getColorScheme() === "light" ? "light" : "dark";
  const [themeMode, setThemeModeState] = useState<ThemeMode>(systemMode);
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [hapticsEnabled, setHapticsEnabledState] = useState(true);
  const [reducedMotion, setReducedMotionState] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(settingsKey).then((value) => {
      if (!value) return;
      try {
        const parsed = JSON.parse(value) as Partial<{
          themeMode: ThemeMode;
          soundEnabled: boolean;
          hapticsEnabled: boolean;
          reducedMotion: boolean;
        }>;
        if (parsed.themeMode === "dark" || parsed.themeMode === "light") setThemeModeState(parsed.themeMode);
        if (typeof parsed.soundEnabled === "boolean") setSoundEnabledState(parsed.soundEnabled);
        if (typeof parsed.hapticsEnabled === "boolean") setHapticsEnabledState(parsed.hapticsEnabled);
        if (typeof parsed.reducedMotion === "boolean") setReducedMotionState(parsed.reducedMotion);
      } catch {
        // Ignore invalid local settings.
      }
    });
  }, []);

  const persist = useCallback((next: Partial<SettingsContextValue>) => {
    const payload = {
      themeMode: next.themeMode ?? themeMode,
      soundEnabled: next.soundEnabled ?? soundEnabled,
      hapticsEnabled: next.hapticsEnabled ?? hapticsEnabled,
      reducedMotion: next.reducedMotion ?? reducedMotion
    };
    SecureStore.setItemAsync(settingsKey, JSON.stringify(payload)).catch(() => undefined);
  }, [hapticsEnabled, reducedMotion, soundEnabled, themeMode]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    persist({ themeMode: mode });
  }, [persist]);

  const setSoundEnabled = useCallback((value: boolean) => {
    setSoundEnabledState(value);
    persist({ soundEnabled: value });
  }, [persist]);

  const setHapticsEnabled = useCallback((value: boolean) => {
    setHapticsEnabledState(value);
    persist({ hapticsEnabled: value });
  }, [persist]);

  const setReducedMotion = useCallback((value: boolean) => {
    setReducedMotionState(value);
    persist({ reducedMotion: value });
  }, [persist]);

  const value = useMemo<SettingsContextValue>(() => ({
    themeMode,
    theme: themes[themeMode],
    soundEnabled,
    hapticsEnabled,
    reducedMotion,
    setThemeMode,
    setSoundEnabled,
    setHapticsEnabled,
    setReducedMotion
  }), [hapticsEnabled, reducedMotion, setHapticsEnabled, setReducedMotion, setSoundEnabled, setThemeMode, soundEnabled, themeMode]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useTheme() {
  const value = useContext(SettingsContext);
  if (!value) {
    throw new Error("SettingsProvider mungon");
  }
  return value;
}
