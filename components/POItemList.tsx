import React from "react";
import { View, Text, FlatList } from "react-native";

type POItemListProps = {
  items: any[];
};

export default function POItemList({ items }: POItemListProps) {
  const renderItem = ({ item }: { item: any }) => (
    <View className="bg-white mx-4 mb-3 p-4 rounded-2xl shadow-sm border border-gray-200">
      <View className="flex-row justify-between mb-1">
        <Text className="text-base font-semibold text-blue-800">
          Item {item.item_no}
        </Text>
        <Text className="text-gray-600 font-medium">
          {item.material_grp ?? "-"}
        </Text>
      </View>

      <Text className="text-gray-800 mb-1">
        <Text className="font-semibold">Material:</Text> {item.material}
      </Text>

      <Text className="text-gray-800 mb-1">
        <Text className="font-semibold">Short Text:</Text>{" "}
        {item.short_text ?? "-"}
      </Text>

      <View className="flex-row justify-between">
        <Text className="text-gray-800">
          <Text className="font-semibold">Plant:</Text> {item.plant_name ?? "-"}
        </Text>
        <Text className="text-gray-800">
          <Text className="font-semibold">Storage Loc:</Text>{" "}
          {item.sloc ?? "-"}
        </Text>
      </View>

      <View className="flex-row justify-between mt-2">
        <Text className="text-gray-800">
          <Text className="font-semibold">Quantity:</Text> {item.qty}
        </Text>
        <Text className="text-gray-800">
          <Text className="font-semibold">Price:</Text> {item.net_price}{" "}
          {item.currency}
        </Text>
      </View>

      {item.deliv_date && (
        <Text className="text-gray-500 mt-1 text-xs">
          Delivery:{" "}
          {new Date(parseInt(item.deliv_date.match(/\d+/)[0])).toLocaleDateString(
            "vi-VN"
          )}
        </Text>
      )}
    </View>
  );

  return (
    <FlatList
      data={items}
      keyExtractor={(i) => `${i.po_number}-${i.item_no}`}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 40 }}
    />
  );
}
