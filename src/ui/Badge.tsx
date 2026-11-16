import { Text } from "react-native";

import { styles } from "./components.styles";

export function Badge({ confidence }: { confidence: "high" | "medium" | "low" }) {
  return <Text style={[styles.badge, styles[confidence]]}>{confidence} confidence</Text>;
}
