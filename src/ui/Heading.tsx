import { Text, View } from "react-native";

import { typography } from "@/theme";

import { styles } from "./components.styles";

export function Heading({
  title,
  subtitle,
  level = "screen",
}: {
  title: string;
  subtitle?: string;
  level?: "screen" | "section";
}) {
  return (
    <View style={styles.field}>
      <Text style={level === "section" ? typography.section : typography.title}>{title}</Text>
      {subtitle && <Text style={typography.caption}>{subtitle}</Text>}
    </View>
  );
}
