import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeScreen" />
      <Stack.Screen name="ProfilScreen" />
      <Stack.Screen name="ChatScreen" />
      <Stack.Screen name="MessageScreen" />
    </Stack>
  );
}