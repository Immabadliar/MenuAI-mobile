import { Text, View } from "react-native";

import { typography } from "@/theme";

import { Button } from "./Button";
import { styles } from "./components.styles";

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: { title: string; onPress: () => void };
}) {
  return (
    <View style={styles.empty}>
      <Text style={typography.displaySmall}>{title}</Text>
      <Text style={typography.caption}>{message}</Text>
      {action && <Button {...action} variant="outline" />}
    </View>
  );
}
