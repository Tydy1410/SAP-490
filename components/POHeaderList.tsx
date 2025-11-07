import React, { forwardRef } from "react";
import { FlatList, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

function formatODataDate(odataDate?: string): string {
  if (!odataDate) return "-";
  const match = /\/Date\((\d+)\)\//.exec(odataDate);
  if (match?.[1]) {
    const date = new Date(parseInt(match[1]));
    return date.toLocaleDateString("vi-VN");
  }
  return "-";
}

const POHeaderList = forwardRef<any, { data: any[] }>(({ data }, ref) => {
  const router = useRouter();

  return (
    <FlatList
      ref={ref}
      data={data}
      keyExtractor={(item, idx) => item?.po_id ?? String(idx)}
      contentContainerStyle={{ paddingBottom: 60, paddingHorizontal: 15 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            router.push({
              pathname: "/po-detail",
              params: { po_id: item.po_id },
            })
          }
        >
          <View className="bg-white rounded-2xl p-4 mb-4 shadow-md border border-gray-200">
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row items-center space-x-2">
                <View className="bg-blue-600 px-2 py-1 rounded-md">
                  <Text className="text-white text-xs font-bold">PO</Text>
                </View>

                <Text className="font-bold text-lg text-blue-800">
                  {item.po_id}
                </Text>
              </View>

              <View className="flex-row items-center space-x-2">
                <View className="bg-blue-100 px-2 py-1 rounded-md flex-row items-center">
                  <MaterialIcons name="business" size={12} color="#1D4ED8" />
                  <Text className="ml-1 text-blue-700 font-semibold text-xs">
                    {item.comp_code}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </View>
            </View>

            <View className="flex-row items-center mb-1">
              <Ionicons name="people" size={16} color="#374151" />
              <Text className="ml-2 text-gray-800 font-semibold">
                {item.vendor_name ?? item.vendor}
              </Text>
            </View>

            <View className="flex-row items-center mb-2">
              <MaterialIcons name="storefront" size={14} color="#6B7280" />
              <Text className="ml-2 text-gray-500 text-sm">
                {item.purch_org_name ?? item.purch_org}
              </Text>
            </View>

            <View className="flex-row justify-between items-end mt-2 pt-2 border-t border-gray-100">
              <View>
                <View className="flex-row items-center mb-1">
                  <FontAwesome5 name="money-bill-wave" size={12} color="#059669" />
                  <Text className="ml-2 text-gray-500 text-xs">Total Amount</Text>
                </View>
                <Text className="font-bold text-green-600 text-lg">
                  {Number(item.total_amount || 0).toLocaleString("vi-VN")}{" "}
                  {item.currency}
                </Text>
              </View>

              <View className="items-end">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="calendar-outline" size={12} color="#6B7280" />
                  <Text className="ml-1 font-semibold text-gray-700 text-sm">
                    {formatODataDate(item.doc_date)}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="person-outline" size={12} color="#9CA3AF" />
                  <Text className="ml-1 text-gray-400 text-xs">
                    {item.created_by}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
});

export default POHeaderList;
