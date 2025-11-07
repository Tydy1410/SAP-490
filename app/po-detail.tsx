import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchPODetail } from "../../SAP-490/services/poService";

function formatODataDate(odataDate?: string): string {
  if (!odataDate) return "-";
  const match = /\/Date\((\d+)\)\//.exec(odataDate);
  if (match?.[1]) {
    return new Date(parseInt(match[1])).toLocaleDateString("vi-VN");
  }
  return "-";
}

export default function PODetailScreen() {
  const { po_id } = useLocalSearchParams<{ po_id: string }>();
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const res = await fetchPODetail(po_id);
        setDetail(res);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [po_id]);

  if (loading)
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#0a6ed1" />
        <Text className="mt-3 text-gray-600">Đang tải chi tiết PO...</Text>
      </SafeAreaView>
    );

  if (!detail)
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-gray-600">Không tìm thấy dữ liệu PO</Text>
      </SafeAreaView>
    );

  const items = detail?.to_Item?.results || [];

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={["top", "left", "right"]}>
      {/* ✅ BACKGROUND TRÀN STATUS BAR */}
      <View className="absolute top-0 left-0 right-0 h-48 bg-blue-600" />

      {/* ✅ HEADER — CỐ ĐỊNH */}
      <View className="px-5 pt-12 pb-6 bg-blue-600 shadow-xl">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="py-2 px-3 bg-white/20 rounded-full"
            activeOpacity={0.7}
          >
            <Text className="text-white text-xl">←</Text>
          </TouchableOpacity>

          <Text className="flex-1 ml-3 text-2xl font-extrabold text-white">
            PO #{detail.po_id}
          </Text>

          <View className="bg-white/30 px-3 py-1 rounded-xl">
            <Text className="font-semibold text-white">{detail.comp_code}</Text>
          </View>
        </View>

        <Text className="mt-3 text-lg font-semibold text-white">
          {detail.vendor_name}
        </Text>

        {/* GRID HEADER INFO */}
        <View className="flex-row justify-between mt-5">
          <View>
            <Text className="text-white/70 text-xs">Purch Org</Text>
            <Text className="text-white font-semibold">{detail.purch_org}</Text>
          </View>

          <View>
            <Text className="text-white/70 text-xs">Currency</Text>
            <Text className="text-white font-semibold">{detail.currency}</Text>
          </View>

          <View>
            <Text className="text-white/70 text-xs">Doc Date</Text>
            <Text className="text-white font-semibold">
              {formatODataDate(detail.doc_date)}
            </Text>
          </View>

          <View>
            <Text className="text-white/70 text-xs">Created By</Text>
            <Text className="text-white font-semibold">{detail.created_by}</Text>
          </View>
        </View>

        <View className="mt-6">
          <Text className="text-xs text-white/70 uppercase">Total Amount</Text>
          <Text className="text-3xl font-extrabold text-green-300">
            {Number(detail.total_amount).toLocaleString("vi-VN")} {detail.currency}
          </Text>
        </View>
      </View>

      {/* ✅ CHỈ CUỘN PHẦN NÀY */}
      <ScrollView className="flex-1 mt-4">
        {/* ORDER ITEMS HEADER */}
        <View className="px-5 flex-row justify-between items-center">
          <Text className="text-lg font-bold text-gray-800">Order Items</Text>

          <View className="bg-blue-100 px-3 py-1 rounded-xl">
            <Text className="text-blue-700 font-semibold text-xs">
              {items.length} items
            </Text>
          </View>
        </View>

        {/* ITEM LIST */}
        {items.map((item: any) => (
          <View
            key={item.item_no}
            className="mx-4 mt-3 mb-1 bg-white rounded-2xl p-4 shadow border border-gray-200"
          >
            {/* HEADER */}
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row items-center space-x-2">
                <View className="bg-blue-600 px-2 py-1 rounded">
                  <Text className="text-white font-bold text-xs">{item.item_no}</Text>
                </View>

                <Text className="font-semibold text-gray-800">
                  Item #{item.item_no}
                </Text>
              </View>

              <View className="bg-purple-100 px-2 py-1 rounded-xl">
                <Text className="text-purple-700 text-xs font-semibold">
                  {item.material_grp ?? "—"}
                </Text>
              </View>
            </View>

            {/* MATERIAL */}
            <Text className="font-semibold text-gray-700">Material</Text>
            <Text className="text-gray-800">{item.material}</Text>

            <Text className="mt-2 font-semibold text-gray-700">Description</Text>
            <Text className="text-gray-800">{item.short_text}</Text>

            {/* GRID */}
            <View className="flex-row justify-between mt-3">
              <View>
                <Text className="font-semibold text-gray-700">Plant</Text>
                <Text className="text-gray-800">{item.plant_name}</Text>
              </View>

              <View>
                <Text className="font-semibold text-gray-700">Storage</Text>
                <Text className="text-gray-800">{item.sloc}</Text>
              </View>
            </View>

            {/* QUANTITY + PRICE */}
            <View className="flex-row justify-between mt-3">
              <View>
                <Text className="font-semibold text-gray-700">Quantity</Text>
                <Text className="text-gray-800">{item.qty}</Text>
              </View>

              <View>
                <Text className="font-semibold text-gray-700">Unit Price</Text>
                <Text className="text-green-600 font-bold">
                  {Number(item.net_price).toLocaleString("vi-VN")} VND
                </Text>
              </View>
            </View>

            {/* DELIVERY */}
            <View className="bg-green-50 px-3 py-2 rounded-xl mt-3">
              <Text className="text-green-700 text-sm font-semibold">
                Delivery: {formatODataDate(item.deliv_date)}
              </Text>
            </View>
          </View>
        ))}

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
