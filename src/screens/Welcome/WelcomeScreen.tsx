import { Text, View } from "react-native";

import { router } from "expo-router";

import { Button, Screen } from "@/ui";
import { GlassSurface } from "@/ui/GlassSurface";

import { styles } from "./Welcome.styles";

export default function WelcomeScreen() {
  return (
    <Screen scroll={false} isImmersive>
      <Text style={styles.brand}>MENUAI</Text>
      <View style={styles.hero}>
        <Text style={styles.headline}>{"Know what\nto order."}</Text>
        <Text style={styles.subtitle}>Menu picks for the way you eat.</Text>
      </View>
      <GlassSurface style={styles.footer}>
        <Button title="Get started" onPress={() => router.push("/welcome/login")} />
        <Text style={styles.legal}>Terms · Privacy</Text>
      </GlassSurface>
    </Screen>
  );
}
