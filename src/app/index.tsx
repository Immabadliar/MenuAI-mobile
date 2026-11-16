import { Redirect } from "expo-router";

import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const { session, profile } = useAuth();
  if (!session) return <Redirect href="/welcome/welcome" />;
  if (!profile?.dietText) return <Redirect href="/(onboarding)/diet" />;
  return <Redirect href="/(tabs)/scan" />;
}
