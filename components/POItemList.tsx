import React from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function POItemList({ items }: { items: any[] }) {
  // Format OData Date
  const formatODataDate = (odataDate?: string) => {
    if (!odataDate) return "-";
    const match = /\/Date\((\d+)\)\//.exec(odataDate);
    if (match?.[1]) {
      return new Date(parseInt(match[1], 10)).toLocaleDateString("vi-VN");
    }
    return "-";
  };

  const renderItem = ({ item }: { item: any }) => (
    <View className="mx-4 mt-3 mb-1 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
      {/* ITEM HEADER */}
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
            {item.material_grp || "—"}
          </Text>
        </View>
      </View>

      {/* MATERIAL */}
      <Text className="font-semibold text-gray-700">Material</Text>
      <Text className="text-gray-800">{item.material || "-"}</Text>

      {/* Description */}
      <Text className="mt-2 font-semibold text-gray-700">Description</Text>
      <Text className="text-gray-800">{item.short_text || "-"}</Text>

      {/* PLANT & STORAGE */}
      <View className="mt-3 flex-row justify-between">
        <View>
          <Text className="font-semibold text-gray-700">Plant</Text>
          <Text className="text-gray-800">{item.plant_name || "-"}</Text>
        </View>

        <View>
          <Text className="font-semibold text-gray-700">Storage</Text>
          <Text className="text-gray-800">{item.sloc || "-"}</Text>
        </View>
      </View>

      {/* QUANTITY + PRICE */}
      <View className="mt-3 flex-row justify-between">
        <View>
          <Text className="font-semibold text-gray-700">Quantity</Text>
          <Text className="text-gray-800">
            {Number(item.qty).toLocaleString("vi-VN")}
          </Text>
        </View>

        <View>
          <Text className="font-semibold text-gray-700">Unit Price</Text>
          <Text className="font-semibold text-green-600">
            {Number(item.net_price).toLocaleString("vi-VN")} {item.currency}
          </Text>
        </View>
      </View>

      {/* DELIVERY */}
      <View className="mt-3 bg-green-50 px-3 py-2 rounded-xl">
        <Text className="text-green-700 text-sm font-medium">
          Delivery: {formatODataDate(item.deliv_date)}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-gray-100">
      <FlatList
        data={items}
        keyExtractor={(i) => `${i.po_number ?? "PO"}-${i.item_no}`}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
