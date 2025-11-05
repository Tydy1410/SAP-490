import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { fetchPODetail } from "../../SAP-490/services/poService";

function formatODataDate(odataDate?: string): string {
  if (!odataDate) return "-";
  const match = /\/Date\((\d+)\)\//.exec(odataDate);
  if (match && match[1]) {
    const timestamp = parseInt(match[1], 10);
    const date = new Date(timestamp);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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
      } catch (err) {
        console.error("❌ Lỗi khi fetch PO detail:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [po_id]);

  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0a6ed1" />
        <Text className="mt-3 text-gray-600">Đang tải chi tiết PO {po_id}...</Text>
      </View>
    );

  if (!detail)
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-600 text-base">
          Không tìm thấy thông tin cho PO {po_id}
        </Text>
      </View>
    );

  const items = detail?.to_Item?.results || [];

  return (
    <View className="flex-1 bg-gray-100">

      {/* ✅ PO HEADER — KHÔNG CUỘN, KHÔNG NẰM TRONG BOX */}
      <View className="px-5 pt-5 pb-3 bg-white border-b border-gray-200">
        <Text className="text-2xl font-extrabold text-[#0a6ed1] mb-2">
          Purchase Order #{detail.po_id}
        </Text>

        <View className="space-y-1.5">
          <Text className="text-gray-800">
            <Text className="font-semibold">Vendor: </Text>
            {detail.vendor_name ?? "-"}
          </Text>
          <Text className="text-gray-800">
            <Text className="font-semibold">Company Code: </Text>
            {detail.comp_code}
          </Text>
          <Text className="text-gray-800">
            <Text className="font-semibold">Purchasing Org: </Text>
            {detail.purch_org}
          </Text>
          <Text className="text-gray-800">
            <Text className="font-semibold">Currency: </Text>
            {detail.currency}
          </Text>
          <Text className="text-gray-800">
            <Text className="font-semibold">Created By: </Text>
            {detail.created_by}
          </Text>
          <Text className="text-gray-800">
            <Text className="font-semibold">Date: </Text>
            {formatODataDate(detail.doc_date)}
          </Text>
        </View>
      </View>

      {/* ✅ ITEM LIST CUỘN — GIỮ NGUYÊN FlatList */}
      <FlatList
        data={items}
        keyExtractor={(i) => `${i.po_number}-${i.item_no}`}
        ListHeaderComponent={
          <Text className="text-lg font-semibold text-gray-800 px-5 mt-4 mb-2">
            Danh sách Item ({items.length})
          </Text>
        }
        renderItem={({ item }) => (
          <View className="bg-white mx-4 my-2 p-4 rounded-2xl shadow-sm border border-gray-200">
            <View className="flex-row justify-between mb-1">
              <Text className="text-base font-semibold text-[#0a6ed1]">
                Item {item.item_no}
              </Text>
              <Text className="text-gray-500 font-medium">{item.material_grp ?? "-"}</Text>
            </View>

            <Text className="text-gray-800 mb-1">
              <Text className="font-semibold">Material:</Text> {item.material}
            </Text>
            <Text className="text-gray-800 mb-1">
              <Text className="font-semibold">Short Text:</Text> {item.short_text ?? "-"}
            </Text>

            <View className="flex-row justify-between">
              <Text className="text-gray-800">
                <Text className="font-semibold">Plant:</Text> {item.plant_name ?? "-"}
              </Text>
              <Text className="text-gray-800">
                <Text className="font-semibold">Storage Loc:</Text> {item.sloc ?? "-"}
              </Text>
            </View>

            <View className="flex-row justify-between mt-2">
              <Text className="text-gray-800">
                <Text className="font-semibold">Quantity:</Text> {item.qty}
              </Text>
              <Text className="text-gray-800">
                <Text className="font-semibold">Price:</Text> {item.net_price} {item.currency}
              </Text>
            </View>

            {item.deliv_date && (
              <Text className="text-gray-500 mt-1 text-xs">
                Delivery:{" "}
                {new Date(parseInt(item.deliv_date.match(/\d+/)[0])).toLocaleDateString("vi-VN")}
              </Text>
            )}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}
