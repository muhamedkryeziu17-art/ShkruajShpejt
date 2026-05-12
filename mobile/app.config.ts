import type { ExpoConfig } from "expo/config";

const easProjectId = process.env.EAS_PROJECT_ID?.trim();

const config: ExpoConfig = {
  name: "ShkruajShpejt",
  slug: "shkruajshpejt",
  scheme: "shkruajshpejt",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  description: "Trajner shkrimi ne shqip per shpejtesi, saktesi dhe perparim.",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#07111f"
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.muki.shkruajshpejt",
    buildNumber: "1",
    infoPlist: {
      CFBundleAllowMixedLocalizations: true
    }
  },
  android: {
    package: "com.muki.shkruajshpejt",
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#07111f"
    }
  },
  plugins: ["expo-router", "expo-secure-store"],
  experiments: {
    typedRoutes: true
  },
  extra: {
    ...(easProjectId ? { eas: { projectId: easProjectId } } : {})
  }
};

export default config;
