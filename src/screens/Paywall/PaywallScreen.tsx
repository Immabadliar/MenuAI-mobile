import { Text, View } from "react-native";

import { router } from "expo-router";

import { typography } from "@/theme";
import { Button, Card, Chip, ErrorState, Heading, Loading, Screen, layout } from "@/ui";

import { usePaywall } from "./usePaywall";

export default function PaywallScreen() {
  const { resource, period, setPeriod, loading, error, purchased, purchase } = usePaywall();
  return (
    <Screen>
      <Heading title="MenuAI Plus" subtitle="Unlimited menu scans." />
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} retry={() => void resource.reload()} />
      ) : purchased || resource.data?.plan === "plus" ? (
        <Card>
          <Text style={typography.heading}>You are on Plus</Text>
          <Text style={typography.body}>Unlimited menu scans are ready.</Text>
        </Card>
      ) : (
        <>
          <Card>
            <Text style={typography.heading}>Free · $0</Text>
            <Text style={typography.body}>3 menu scans per week</Text>
            <Text style={typography.caption}>
              Diet profile, companions, order scripts, and scan history
            </Text>
          </Card>
          <Card>
            <Text style={typography.heading}>Plus</Text>
            <Text style={typography.body}>Unlimited menu scans</Text>
            <Text style={typography.caption}>All Free features for you and your whole table</Text>
            <View style={layout.row}>
              <Chip
                label="$4.99 / month"
                selected={period === "monthly"}
                onPress={() => setPeriod("monthly")}
              />
              <Chip
                label="$29.99 / year"
                selected={period === "yearly"}
                onPress={() => setPeriod("yearly")}
              />
            </View>
          </Card>
          <Text style={typography.caption}>
            Demo purchase · no payment will be taken. Your mock plan changes to Plus.
          </Text>
          <Button
            title={period === "yearly" ? "Get Plus · $29.99 / year" : "Get Plus · $4.99 / month"}
            loading={loading}
            onPress={() => void purchase()}
          />
        </>
      )}
      {error !== "" && <ErrorState message={error} />}
      <Button title="Done" variant="outline" onPress={() => router.back()} />
    </Screen>
  );
}
