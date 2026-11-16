import { useEffect } from "react";
import { Text, View } from "react-native";

import { haptics } from "@/lib/haptics";

import { Button } from "./Button";
import { styles } from "./components.styles";

export function ErrorState({ message, retry }: { message: string; retry?: () => void }) {
  useEffect(() => {
    haptics.warning();
  }, [message]);
  return (
    <View style={styles.empty}>
      <Text accessibilityRole="alert" style={styles.error}>
        {message}
      </Text>
      {retry && <Button title="Try again" onPress={retry} variant="outline" />}
    </View>
  );
}
