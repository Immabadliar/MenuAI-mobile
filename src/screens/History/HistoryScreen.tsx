import { Image, Pressable, Text, View } from "react-native";

import { router } from "expo-router";

import { typography } from "@/theme";
import { Card, EmptyState, ErrorState, Heading, Loading, Screen } from "@/ui";
import { FeedbackForm } from "@/ui/FeedbackForm";

import { styles } from "./History.styles";
import { useHistory } from "./useHistory";

export default function HistoryScreen() {
  const { resource, completed, setCompleted } = useHistory();
  return (
    <Screen>
      <Heading title="Your scans" />
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} retry={() => void resource.reload()} />
      ) : !resource.data?.scans.length ? (
        <EmptyState
          title="No scans yet."
          message="Scan a menu to save your dish suggestions here."
          action={{
            title: "Scan menu",
            onPress: () => router.navigate("/(tabs)/scan"),
          }}
        />
      ) : (
        <>
          {resource.data.prompts
            .filter((scan) => !completed.includes(scan.id))
            .map((scan) => (
              <FeedbackForm
                key={scan.id}
                scan={scan}
                onDone={() => setCompleted((current) => [...current, scan.id])}
              />
            ))}
          {resource.data.scans.map((scan) => (
            <Pressable
              key={scan.id}
              accessibilityRole="button"
              accessibilityLabel={`Open ${scan.restaurantName || "Menu scan"}`}
              onPress={() => router.push({ pathname: "/scan/[id]", params: { id: scan.id } })}
            >
              <Card>
                <View style={styles.row}>
                  {scan.imageUris[0] ? (
                    <Image source={{ uri: scan.imageUris[0] }} style={styles.thumbnail} />
                  ) : (
                    <View style={styles.placeholder}>
                      <Text style={typography.caption}>Menu</Text>
                    </View>
                  )}
                  <View style={styles.details}>
                    <Text style={typography.heading}>{scan.restaurantName || "Menu scan"}</Text>
                    <Text style={typography.caption}>
                      {new Date(scan.createdAt).toLocaleDateString()} · {scan.status}
                    </Text>
                  </View>
                </View>
              </Card>
            </Pressable>
          ))}
        </>
      )}
    </Screen>
  );
}
