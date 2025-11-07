import CustomButton from "components/CustomButton";
import React, { useRef, useEffect } from "react";
import { router } from "expo-router";
import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

export default function WelcomeScreen({ navigation }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View className="flex-1 bg-white">
      {/* ✅ Background Gradient Layer */}
      <View className="absolute inset-0 bg-gradient-to-b from-blue-600 to-purple-600" />

      <SafeAreaView className="flex-1 items-center justify-center px-8">
        <Animated.View style={{ opacity: fadeAnim }} className="items-center">
          
          <Image
            source={require("../assets/welcome_page.png")} 
            className="h-64 w-64 mb-6"
            resizeMode="contain"
          />

          <Text className="text-3xl font-extrabold text-blue-600  text-center mb-3">
            Welcome to PO Manager
          </Text>

          <Text className="text-center font-semibold text-blue-600 text-base leading-6 mb-8">
            Quản lý Purchase Orders dễ dàng — theo dõi, lọc, kiểm tra 
            và xem chi tiết PO một cách nhanh chóng và chính xác.
          </Text>

           <CustomButton
            title="Continue with your account"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mx-auto px-5 py-5 bg-blue-400 rounded-xl"
            textStyles="text-white text-xl font-semibold"
          />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
