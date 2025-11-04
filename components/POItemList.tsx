// components/POItemList.tsx
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

type POItemListProps = {
  items: any[];
};

export default function POItemList({ items }: POItemListProps) {
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.title}>
        Item {item.item_no} — {item.short_text}
      </Text>
      <Text>Material: {item.material}</Text>
      <Text>Material Group: {item.material_grp}</Text>
      <Text>Plant: {item.plant_name}</Text>
      <Text>Storage Loc: {item.sloc}</Text>
      <Text>Quantity: {item.qty}</Text>
      <Text>Price: {item.net_price} {item.currency}</Text>
    </View>
  );

  return (
    <FlatList
      data={items}
      keyExtractor={(i) => `${i.po_number}-${i.item_no}`}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  title: {
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 4,
  },
});
