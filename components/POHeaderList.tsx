import React, { forwardRef } from "react";
import { FlatList, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

type Props = { data: any[] };

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

const POHeaderList = forwardRef<FlatList, Props>(({ data }, ref) => {
  const router = useRouter();

  

  return (
    <FlatList
      ref={ref}
      data={data}
      keyExtractor={(item, idx) => item?.po_id ?? String(idx)}
      contentContainerStyle={{ paddingBottom: 40 }}
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
          <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-200 shadow-sm">
            {/* PO Number + Company */}
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-bold text-blue-800">
                PO {item.po_id}
              </Text>
              <Text className="text-gray-700 font-semibold">
                {item.comp_code}
              </Text>
            </View>

            {/* Vendor */}
            <Text className="text-gray-800 font-medium mb-1">
              {item.vendor_name ?? item.vendor}
            </Text>

            {/* Purchasing Org */}
            <Text className="text-gray-500 text-sm mb-2">
              {item.purch_org_name ?? item.purch_org}
            </Text>

            {/* Total + Currency + Date + Created By */}
            <View className="flex-row justify-between items-end">
              <View>
                <Text className="text-gray-900 font-semibold text-base">
                  {Number(item.total_amount || 0).toLocaleString("vi-VN")}{" "}
                  {item.currency}
                </Text>
                <Text className="text-gray-500 text-xs">Total Amount</Text>
              </View>

              <View className="items-end">
                <Text className="text-gray-700 font-medium text-sm">
                  {formatODataDate(item.doc_date)}
                </Text>
                <Text className="text-gray-500 text-xs">
                  Created by {item.created_by}
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
