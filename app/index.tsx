import CustomButton from "components/CustomButton";
import React from "react";
import { router } from "expo-router";
import { View, Text, Image } from "react-native";
import "../global.css";

export default function WelcomeScreen({ navigation }: any) {
  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      {/* Background circles */}
      <View className="absolute -top-32 -right-32 w-80 h-80 bg-blue-400 rounded-full opacity-10" />
      <View className="absolute -bottom-32 -left-32 w-80 h-80 bg-cyan-400 rounded-full opacity-10" />

      {/* Logo Container */}
      <View className="mb-10">
        <View className="bg-white rounded-3xl p-10 border-2 border-blue-100">
          <Image
            source={require("../assets/welcome_page.png")}
            className="h-48 w-48"
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Title Section */}
      <View className="mb-4 items-center">
        <Text className="text-6xl font-black text-slate-800 text-center leading-tight mb-3">
          PO Manager
        </Text>
        <View className="flex-row items-center">
          <View className="h-1 w-20 bg-blue-600 rounded-l-full" />
          <View className="h-1 w-16 bg-blue-500" />
          <View className="h-1 w-12 bg-cyan-500" />
          <View className="h-1 w-16 bg-cyan-400" />
          <View className="h-1 w-20 bg-cyan-600 rounded-r-full" />
        </View>
      </View>

      {/* Subtitle */}
      <View className="mb-12 px-6">
        <Text className="text-center text-slate-500 text-base leading-7 font-medium">
          Purchase Order Management
        </Text>
        <Text className="text-center text-blue-600 text-xl leading-8 font-bold mt-1">
          Simple & Accurate
        </Text>
      </View>

      {/* CTA Button */}
      <View className="w-full px-2">
        <CustomButton
          title="Get Started"
          handlePress={() => router.replace("/sign-in")}
          containerStyles="w-full bg-blue-600 rounded-2xl px-8 py-6"
          textStyles="text-white text-xl font-bold text-center"
        />
      </View>

      <Text className="text-slate-400 text-sm mt-5 text-center font-medium">
        Sign in to continue
      </Text>

      {/* Footer Credit */}
      <View className="absolute bottom-6 self-center">
        <Text className="text-slate-300 text-xs text-center font-light">
          CREATED BY FA25SAP11
        </Text>
      </View>
    </View>
  );
}
