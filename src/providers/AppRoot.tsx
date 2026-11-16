import { useEffect } from "react";
import { Text, View } from "react-native";

import { DMSans_400Regular, DMSans_500Medium } from "@expo-google-fonts/dm-sans";
import { Fraunces_600SemiBold } from "@expo-google-fonts/fraunces";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import { useAuth } from "@/hooks/useAuth";
import { RootNavigator } from "@/navigation/RootNavigator";
import { styles } from "@/ui/components.styles";
import { GlassRefraction } from "@/ui/GlassRefraction";

import { AuthProvider } from "./AuthProvider";
import { DietDraftProvider } from "./DietDraftProvider";

void SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function AppRoot() {
  const [isLoaded, error] = useFonts({
    Fraunces_600SemiBold,
    DMSans_400Regular,
    DMSans_500Medium,
  });

  useEffect(() => {
    if (isLoaded || error) void SplashScreen.hideAsync().catch(() => undefined);
  }, [isLoaded, error]);

  if (error) {
    return (
      <View style={styles.content}>
        <Text>Fonts could not load. Please reopen MenuAI.</Text>
      </View>
    );
  }
  if (!isLoaded) return null;

  return (
    <View style={styles.screen}>
      <GlassRefraction />
      <AuthProvider>
        <SessionContent />
      </AuthProvider>
    </View>
  );
}

function SessionContent() {
  const { session } = useAuth();
  return (
    <DietDraftProvider key={session?.userId ?? "guest"}>
      <RootNavigator />
    </DietDraftProvider>
  );
}
