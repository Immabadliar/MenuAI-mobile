import { Stack } from "expo-router";

import { useAuth } from "@/hooks/useAuth";
import { ErrorState, Loading, Screen } from "@/ui";
import { styles as surfaceStyles } from "@/ui/GlassSurface.styles";

export function RootNavigator() {
  const { session, profile, loading, isInitialized, error, refresh } = useAuth();
  if (loading && !isInitialized)
    return (
      <Screen>
        <Loading message="Opening MenuAI…" />
      </Screen>
    );
  if (error)
    return (
      <Screen>
        <ErrorState message={error} retry={() => void refresh()} />
      </Screen>
    );
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: surfaceStyles.native }}>
      <Stack.Screen name="index" />
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="welcome/welcome" />
        <Stack.Screen name="welcome/login" />
      </Stack.Protected>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(onboarding)" />
      </Stack.Protected>
      <Stack.Protected guard={!!session && !!profile?.dietText}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="scan/[id]" />
        <Stack.Screen name="scan/order" options={{ presentation: "modal" }} />
        <Stack.Screen name="companion/[id]" />
        <Stack.Screen name="paywall" options={{ presentation: "modal" }} />
      </Stack.Protected>
    </Stack>
  );
}
