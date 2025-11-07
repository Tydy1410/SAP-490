import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchPODetail } from "../../../SAP-490/services/poService";
import LoadingScreen from "../../components/LoadingScreen";
import EmptyState from "../../components/EmptyState";

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

  if (loading) return <LoadingScreen />;

  if (!detail)
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-gray-600">Không tìm thấy dữ liệu PO</Text>
      </SafeAreaView>
    );

  const items = detail?.to_Item?.results || [];

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={["top", "left", "right"]}>
      <LinearGradient
        colors={['#1e40af', '#2563eb', '#3b82f6']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 192 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <LinearGradient
        colors={['#1e40af', '#2563eb', '#3b82f6']}
        style={{ paddingHorizontal: 20, paddingTop: 48, paddingBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="py-2 px-3 bg-white/20 rounded-full flex-row items-center"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>

          <View className="flex-1 ml-3 flex-row items-center">
            <MaterialIcons name="receipt" size={24} color="white" />
            <Text className="ml-2 text-2xl font-extrabold text-white">
              PO {detail.po_id}
            </Text>
          </View>

          <View className="bg-white/30 px-3 py-1 rounded-xl flex-row items-center">
            <MaterialIcons name="business" size={14} color="white" />
            <Text className="ml-1 font-semibold text-white">{detail.comp_code}</Text>
          </View>
        </View>

        <View className="mt-3 flex-row items-center">
          <Ionicons name="people" size={18} color="white" />
          <Text className="ml-2 text-lg font-semibold text-white">
            {detail.vendor_name}
          </Text>
        </View>

        <View className="flex-row justify-between mt-5">
          <View>
            <View className="flex-row items-center mb-1">
              <MaterialIcons name="storefront" size={12} color="rgba(255,255,255,0.7)" />
              <Text className="ml-1 text-white/70 text-xs">Purch Org</Text>
            </View>
            <Text className="text-white font-semibold">{detail.purch_org}</Text>
          </View>

          <View>
            <View className="flex-row items-center mb-1">
              <FontAwesome5 name="money-bill-wave" size={10} color="rgba(255,255,255,0.7)" />
              <Text className="ml-1 text-white/70 text-xs">Currency</Text>
            </View>
            <Text className="text-white font-semibold">{detail.currency}</Text>
          </View>

          <View>
            <View className="flex-row items-center mb-1">
              <Ionicons name="calendar" size={12} color="rgba(255,255,255,0.7)" />
              <Text className="ml-1 text-white/70 text-xs">Doc Date</Text>
            </View>
            <Text className="text-white font-semibold">
              {formatODataDate(detail.doc_date)}
            </Text>
          </View>

          <View>
            <View className="flex-row items-center mb-1">
              <Ionicons name="person" size={12} color="rgba(255,255,255,0.7)" />
              <Text className="ml-1 text-white/70 text-xs">Created By</Text>
            </View>
            <Text className="text-white font-semibold">{detail.created_by}</Text>
          </View>
        </View>

        <View className="mt-6">
          <View className="flex-row items-center mb-1">
            <FontAwesome5 name="dollar-sign" size={12} color="rgba(255,255,255,0.7)" />
            <Text className="ml-2 text-xs text-white/70 uppercase">Total Amount</Text>
          </View>
          <Text className="text-3xl font-extrabold text-green-300">
            {Number(detail.total_amount).toLocaleString("vi-VN")} {detail.currency}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 mt-4">
        {items.length === 0 ? (
          <EmptyState
            icon="inventory"
            title="No Items Found"
            message="This purchase order doesn't have any items yet."
          />
        ) : (
          <>
            <View className="px-5 flex-row justify-between items-center">
              <View className="flex-row items-center">
                <MaterialIcons name="inventory" size={22} color="#1F2937" />
                <Text className="ml-2 text-lg font-bold text-gray-800">Order Items</Text>
              </View>

              <View className="bg-blue-100 px-3 py-1 rounded-xl flex-row items-center">
                <Ionicons name="cube" size={14} color="#1D4ED8" />
                <Text className="ml-1 text-blue-700 font-semibold text-xs">
                  {items.length} items
                </Text>
              </View>
            </View>

            {items.map((item: any) => (
              <View
                key={item.item_no}
                className="mx-4 mt-3 mb-1 bg-white rounded-2xl p-4 shadow border border-gray-200"
              >
                <View className="flex-row justify-between items-center mb-2">
                  <View className="flex-row items-center">
                    <View className="bg-blue-600 px-2 py-1 rounded">
                      <Text className="text-white font-bold text-xs">{item.item_no}</Text>
                    </View>

                    <Text className="ml-2 font-semibold text-gray-800">
                      Item
                    </Text>
                  </View>

                  <View className="bg-purple-100 px-2 py-1 rounded-xl flex-row items-center">
                    <MaterialIcons name="category" size={12} color="#7C3AED" />
                    <Text className="ml-1 text-purple-700 text-xs font-semibold">
                      {item.material_grp ?? "—"}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center mt-2">
                  <MaterialIcons name="widgets" size={16} color="#374151" />
                  <Text className="ml-2 font-semibold text-gray-700">Material</Text>
                </View>
                <Text className="ml-6 text-gray-800">{item.material}</Text>

                <View className="flex-row items-center mt-2">
                  <Ionicons name="document-text" size={16} color="#374151" />
                  <Text className="ml-2 font-semibold text-gray-700">Description</Text>
                </View>
                <Text className="ml-6 text-gray-800">{item.short_text}</Text>

                <View className="flex-row justify-between mt-3">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <MaterialIcons name="factory" size={14} color="#374151" />
                      <Text className="ml-1 font-semibold text-gray-700 text-sm">Plant</Text>
                    </View>
                    <Text className="ml-5 text-gray-800">{item.plant_name}</Text>
                  </View>

                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <MaterialIcons name="storage" size={14} color="#374151" />
                      <Text className="ml-1 font-semibold text-gray-700 text-sm">Storage</Text>
                    </View>
                    <Text className="ml-5 text-gray-800">{item.sloc}</Text>
                  </View>
                </View>

                <View className="flex-row justify-between mt-3">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Ionicons name="layers" size={14} color="#374151" />
                      <Text className="ml-1 font-semibold text-gray-700 text-sm">Quantity</Text>
                    </View>
                    <Text className="ml-5 text-gray-800">{item.qty}</Text>
                  </View>

                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <FontAwesome5 name="tag" size={12} color="#059669" />
                      <Text className="ml-1 font-semibold text-gray-700 text-sm">Unit Price</Text>
                    </View>
                    <Text className="ml-5 text-green-600 font-bold">
                      {Number(item.net_price).toLocaleString("vi-VN")} VND
                    </Text>
                  </View>
                </View>

                <View className="bg-green-50 px-3 py-2 rounded-xl mt-3 flex-row items-center">
                  <Ionicons name="checkmark-done-circle" size={18} color="#059669" />
                  <Text className="ml-2 text-green-700 text-sm font-semibold">
                    Delivery: {formatODataDate(item.deliv_date)}
                  </Text>
                </View>
              </View>
            ))}

            <View className="h-20" />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}