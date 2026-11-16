import { Text } from "react-native";

import { router } from "expo-router";

import { typography } from "@/theme";
import { Button, Card, EmptyState, ErrorState, Heading, Loading, Screen, TextField } from "@/ui";

import { useSettings } from "./useSettings";

export default function SettingsScreen() {
  const {
    profile,
    setDraft,
    resource,
    name,
    setName,
    busy,
    error,
    notice,
    saveName,
    signOut,
    deleteAccount,
  } = useSettings();
  return (
    <Screen>
      <Heading title="Settings" />
      <Card>
        <TextField label="Display name" value={name} onChangeText={setName} autoComplete="name" />
        <Button
          title="Save name"
          variant="outline"
          loading={busy === "name"}
          disabled={!!busy}
          onPress={() => void saveName()}
        />
      </Card>
      <Card>
        <Text style={typography.heading}>Your diet</Text>
        <Text style={typography.body}>{profile?.dietText || "No diet added yet."}</Text>
        <Text style={typography.caption}>
          Allergies · {profile?.allergies.join(", ") || "None"}
        </Text>
        <Button
          title="Edit diet"
          variant="outline"
          onPress={() => {
            setDraft(null);
            router.push("/(onboarding)/diet");
          }}
        />
      </Card>
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} retry={() => void resource.reload()} />
      ) : (
        <>
          <Heading level="section" title="Companions" subtitle="Save the people you eat with." />
          {!resource.data?.companions.length ? (
            <EmptyState
              title="Eating together?"
              message="Add a companion to get whole-table picks."
            />
          ) : (
            resource.data.companions.map((person) => (
              <Card key={person.id}>
                <Text style={typography.heading}>{person.name}</Text>
                <Text style={typography.caption}>{person.dietText}</Text>
                <Button
                  title={`Edit ${person.name}`}
                  variant="text"
                  onPress={() =>
                    router.push({
                      pathname: "/companion/[id]",
                      params: { id: person.id },
                    })
                  }
                />
              </Card>
            ))
          )}
          <Button
            title="Add companion"
            variant="outline"
            onPress={() =>
              router.push({
                pathname: "/companion/[id]",
                params: { id: "new" },
              })
            }
          />
          <Card>
            <Text style={typography.heading}>
              {resource.data?.plan.plan === "plus" ? "MenuAI Plus" : "Free plan"}
            </Text>
            <Text style={typography.caption}>
              {resource.data?.plan.plan === "plus"
                ? "Unlimited scans"
                : `${resource.data?.plan.scansLeftThisWeek} scans left this week`}
            </Text>
            {resource.data?.plan.plan !== "plus" && (
              <Button title="Upgrade" onPress={() => router.push("/paywall")} />
            )}
          </Card>
        </>
      )}
      {error !== "" && <ErrorState message={error} />}
      {notice !== "" && (
        <Text accessibilityLiveRegion="polite" style={typography.caption}>
          {notice}
        </Text>
      )}
      <Button
        title="Sign out"
        variant="outline"
        loading={busy === "signout"}
        disabled={!!busy}
        onPress={() => void signOut()}
      />
      <Button title="Delete account" variant="text" onPress={deleteAccount} />
    </Screen>
  );
}
