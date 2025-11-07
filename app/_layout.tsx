import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Danh sách PO", headerShown: false }}
      />
      <Stack.Screen
        name="po-detail"
        options={{ title: "Chi tiết PO", headerBackTitle: "Trở về", headerShown: false }}
      />
    </Stack>
  );
}