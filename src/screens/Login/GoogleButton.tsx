import { Image, Pressable, Text } from "react-native";

import { GlassSurface } from "@/ui/GlassSurface";

import { styles } from "./Login.styles";

export function GoogleButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Continue with Google"
      onPress={onPress}
      style={({ pressed }) => [styles.googleWrapper, pressed && styles.pressed]}
    >
      <GlassSurface isPill style={styles.googleButton}>
        <Image
          source={require("@/assets/images/google-logo.png")}
          style={styles.googleLogo}
          resizeMode="contain"
          accessible={false}
        />
        <Text style={styles.googleText}>Continue with Google</Text>
      </GlassSurface>
    </Pressable>
  );
}
