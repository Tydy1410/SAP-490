// app/po-detail.tsx
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";
import { fetchPODetail } from "../services/poService";
import POItemList from "../components/POItemList";

export default function PODetailScreen() {
  const { po_id } = useLocalSearchParams();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetchPODetail(po_id as string);
      setItems(res.to_Item?.results || []);
      setLoading(false);
    };
    load();
  }, [po_id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Đang tải chi tiết PO {po_id}...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <POItemList items={items} />
    </View>
  );
}
