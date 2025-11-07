import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
//import { login } from "../../services/poService";

export default function SignIN() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);   // ✅ FIXED: phải là false

  const handleLogin = async () => {
   /*  if (!username || !password) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập Username và Password!");
      return;
    }

    setLoading(true);

    // ✅ gọi login API đúng cách
    const result: any = await login(username, password);

    setLoading(false);

    if (!result.success) {
      Alert.alert("Đăng nhập thất bại", String(result.message));
      return;
    }

    Alert.alert("Thành công", "Đăng nhập thành công!", [
      {
        text: "OK",
        onPress: () => router.replace("/po-list"),
      },
    ]); */
    router.replace("/po-list")
  };

  return (
    <View className="flex-1 bg-blue-600">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 justify-center px-8"
        >
          {/* ✅ Logo + Title */}
          <View className="mb-12 items-center">
            <Text className="text-4xl font-extrabold text-white">PO Manager</Text>
            <Text className="mt-2 text-base text-white/70">
              Đăng nhập để tiếp tục
            </Text>
          </View>

          {/* ✅ Form */}
          <View className="rounded-3xl bg-white p-6 shadow-xl">

            <Text className="mb-1 text-sm font-semibold text-gray-700">
              Username
            </Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Nhập username..."
              autoCapitalize="none"
              className="mb-4 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
            />

            <Text className="mb-1 text-sm font-semibold text-gray-700">
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Nhập password..."
              secureTextEntry
              autoCapitalize="none"
              className="mb-4 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
            />

            {/* ✅ Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className="mt-2 items-center rounded-xl bg-blue-600 py-4"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-lg font-bold text-white">Sign In</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
