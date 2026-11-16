import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";

export default function OldDetail() {
  const { id } = useLocalSearchParams();
  return <Text>old detail {id}</Text>;
}
