import { Text, View } from "react-native";

import { router } from "expo-router";

import { typography } from "@/theme";
import { Button, Chip, ErrorState, Heading, Loading, Screen, TextField, layout } from "@/ui";

import { CameraPanel } from "./CameraPanel";
import { MenuPages } from "./MenuPages";
import { useScan } from "./useScan";

export default function ScanScreen() {
  const flow = useScan();
  const { resource } = flow;
  return (
    <Screen>
      <Heading title="Scan a menu" subtitle="Up to 3 pages. One photo at a time." />
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} retry={() => void resource.reload()} />
      ) : (
        <Text style={typography.caption}>
          {resource.data?.plan.plan === "plus"
            ? "Plus · unlimited scans"
            : `${resource.data?.plan.scansLeftThisWeek ?? 0} scans left this week`}
        </Text>
      )}
      <CameraPanel flow={flow} />
      <Button
        title="Import screenshot"
        variant="outline"
        loading={flow.busy === "import"}
        disabled={!!flow.busy || flow.pages.length === 3}
        onPress={() => void flow.handleImport()}
      />
      <MenuPages flow={flow} />
      <TextField
        label="Restaurant name (optional)"
        value={flow.restaurant}
        onChangeText={flow.setRestaurant}
        editable={!flow.busy}
      />
      <Heading
        level="section"
        title="Who's eating?"
        subtitle="Add your companions for whole-table picks."
      />
      <View style={layout.row}>
        <Chip label="Me" selected onPress={() => {}} />
        {resource.data?.companions.map((person) => (
          <Chip
            key={person.id}
            label={person.name}
            selected={flow.selected.includes(person.id)}
            onPress={() => flow.handleTogglePerson(person.id)}
          />
        ))}
      </View>
      {resource.data?.companions.length === 0 && (
        <Button
          title="Add a companion"
          variant="text"
          onPress={() => router.push({ pathname: "/companion/[id]", params: { id: "new" } })}
        />
      )}
      {flow.error !== "" && <ErrorState message={flow.error} />}
      <Button
        title={resource.data?.plan.scansLeftThisWeek === 0 ? "Upgrade to scan" : "Scan menu"}
        loading={flow.busy === "scan"}
        disabled={!flow.pages.length || !!flow.busy || !resource.data || !!resource.error}
        onPress={() => void flow.handleScan()}
      />
      <Text style={typography.caption}>
        Demo · these are sample dishes, regardless of the photo.
      </Text>
    </Screen>
  );
}
