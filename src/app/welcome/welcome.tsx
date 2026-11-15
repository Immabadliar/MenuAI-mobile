import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const foodIcons = [
  { emoji: "🥑", top: "9%", left: "19%", color: "#FFD3BD" },
  { emoji: "📍", top: "2%", left: "62%", color: "#F2D5FF" },
  { emoji: "🍋", top: "32%", left: "83%", color: "#FFF0A6" },
  { emoji: "🥗", top: "37%", left: "40%", color: "#D8F6C8" },
  { emoji: "🍓", top: "65%", left: "3%", color: "#C8DEFF" },
  { emoji: "🍜", top: "77%", left: "65%", color: "#E6C9FF" },
] as const;

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Decorative food illustration */}
        <View
          style={styles.illustration}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <View style={[styles.orbit, styles.outerOrbit]} />
          <View style={[styles.orbit, styles.middleOrbit]} />
          <View style={[styles.orbit, styles.innerOrbit]} />
          <Text style={styles.sparkle}>✦</Text>

          {foodIcons.map(({ emoji, top, left, color }) => (
            <View
              key={emoji}
              style={[styles.foodIcon, { top, left, backgroundColor: color }]}
            >
              <Text style={styles.emoji}>{emoji}</Text>
            </View>
          ))}
        </View>

        {/* Welcome text */}
        <View style={styles.top}>
          <Text style={styles.brand}>menuai✦</Text>
          <Text style={styles.h1}>Your best order</Text>
          <Text style={styles.accent}>Starts Here</Text>
          <Text style={styles.subtitle}>
            Find the best order for your diet, at any restaurant.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/welcome/login")}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FBF7FA",
    backgroundImage:
      "linear-gradient(125deg, #DCEFF6 0%, #FCEBE4 40%, #FBF7FA 75%)",
  },
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 24,
  },
  illustration: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  orbit: {
    position: "absolute",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 999,
    aspectRatio: 1,
  },
  outerOrbit: {
    width: "126%",
  },
  middleOrbit: {
    width: "84%",
  },
  innerOrbit: {
    width: "42%",
  },
  sparkle: {
    fontSize: 88,
    color: "#D48AE0",
  },
  foodIcon: {
    position: "absolute",
    width: "17%",
    aspectRatio: 1,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 32,
  },
  top: {
    flexShrink: 0,
    alignItems: "center",
    gap: 8,
  },
  brand: {
    marginBottom: 8,
    fontSize: 28,
    fontWeight: "600",
    letterSpacing: -1.5,
    color: "#99969A",
  },
  h1: {
    fontSize: 36,
    fontWeight: "600",
    letterSpacing: -1.3,
    color: "#181619",
    textAlign: "center",
  },
  accent: {
    fontSize: 36,
    fontWeight: "600",
    letterSpacing: -1.3,
    color: "#BF65D9",
    textAlign: "center",
  },
  subtitle: {
    maxWidth: 290,
    marginTop: 8,
    fontSize: 15,
    lineHeight: 23,
    color: "#7B747E",
    textAlign: "center",
  },
  button: {
    flexShrink: 0,
    minHeight: 58,
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 17,
    borderRadius: 999,
    backgroundColor: "#181619",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
