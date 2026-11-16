import { Text } from "react-native";

import { router } from "expo-router";

import { Button, EmptyState, ErrorState, Heading, Loading, Screen } from "@/ui";

import { styles } from "./Order.styles";
import { useOrder } from "./useOrder";

export default function OrderScreen() {
  const { loading, error, reload, copied, copyError, pick, copy } = useOrder();
  return (
    <Screen>
      <Heading title="How to order" subtitle={pick?.dish} />
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} retry={() => void reload()} />
      ) : pick ? (
        <>
          <Text selectable style={styles.script}>
            {pick.order_script}
          </Text>
          <Button title={copied ? "Copied" : "Copy order"} onPress={() => void copy()} />
        </>
      ) : (
        <EmptyState title="Order unavailable" message="Return to the scan and choose a dish." />
      )}
      {copyError !== "" && <ErrorState message={copyError} />}
      <Button title="Done" variant="outline" onPress={() => router.back()} />
    </Screen>
  );
}
