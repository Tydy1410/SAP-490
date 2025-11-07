import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, title: "Danh sách PO" }}
      />
      <Stack.Screen
        name="po-detail"
        options={{ headerShown: false, title: "Chi tiết PO", headerBackTitle: "Trở về" }}
      />
    </Stack>
  );
}
