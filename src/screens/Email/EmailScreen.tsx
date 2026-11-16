import { router } from "expo-router";

import { Button, ErrorState, Heading, Screen, TextField } from "@/ui";

import { useEmail } from "./useEmail";

export default function EmailScreen() {
  const { email, setEmail, error, loading, send } = useEmail();
  return (
    <Screen scroll={false}>
      <Button title="Back" variant="text" onPress={() => router.back()} />
      <Heading
        title="Let's get you started"
        subtitle="We'll email you a code to log in or create your account."
      />
      <TextField
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        returnKeyType="done"
        editable={!loading}
        onSubmitEditing={() => void send()}
      />
      {error !== "" && <ErrorState message={error} />}
      <Button title="Continue" loading={loading} onPress={() => void send()} />
    </Screen>
  );
}
