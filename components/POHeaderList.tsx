import React, { forwardRef } from "react";
import { FlatList, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

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
            {/* ✅ Top Row */}
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
                <View className="bg-blue-100 px-2 py-1 rounded-md">
                  <Text className="text-blue-700 font-semibold text-xs">
                    {item.comp_code}
                  </Text>
                </View>
              </View>
            </View>

            {/* ✅ Vendor */}
            <Text className="text-gray-800 font-semibold">
              {item.vendor_name ?? item.vendor}
            </Text>

            {/* ✅ Pur.Org */}
            <Text className="text-gray-500 text-sm mb-2">
              {item.purch_org_name ?? item.purch_org}
            </Text>

            {/* ✅ Footer */}
            <View className="flex-row justify-between items-end mt-2">
              <View>
                <Text className="font-bold text-green-600 text-lg">
                  {Number(item.total_amount || 0).toLocaleString("vi-VN")}{" "}
                  {item.currency}
                </Text>
                <Text className="text-gray-500 text-xs">Total Amount</Text>
              </View>

              <View className="items-end">
                <Text className="font-semibold text-gray-700 text-sm">
                  {formatODataDate(item.doc_date)}
                </Text>
                <Text className="text-gray-400 text-xs">
                  {item.created_by}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
});

export default POHeaderList;
