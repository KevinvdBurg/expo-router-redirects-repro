import { Link } from "expo-router";
import { View } from "react-native";

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 24 }}>
      <Link href="/old/123">Open /old/123 (expected: old detail, actual: new)</Link>
      <Link href="/invoices">Open /invoices (expected: invoice list, actual: stack overflow)</Link>
    </View>
  );
}
