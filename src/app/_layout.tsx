import "../global.css";
import { Slot, Stack, Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SafeAreaView, Text , View} from "react-native";

export default function Layout() {
  return (
    <View className="flex flex-1 items-center justify-center ">
      <Text className="text-pink-400 text-4xl">Hello</Text>
    </View>
  );
}
