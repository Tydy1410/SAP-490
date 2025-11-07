import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { itemCardStyles as styles } from '../styles/itemCard';

type POItem = {
    po_number: string;
    item_no: string;
    material: string;
    material_grp?: string;
    short_text?: string;
    plant_name?: string;
    sloc?: string;
    qty: string;
    net_price: string;
    currency: string;
    deliv_date?: string;
};

type POItemCardProps = {
    item: POItem;
};

export default function POItemCard({ item }: POItemCardProps) {
    const formatDeliveryDate = (odataDate?: string): string => {
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
    };

    return (
        <View style={styles.itemCard}>
            {/* Item header */}
            <View style={styles.itemHeader}>
                <View style={styles.itemHeaderLeft}>
                    <View style={styles.itemNumberBadge}>
                        <Text style={styles.itemNumberText}>{item.item_no}</Text>
                    </View>
                    <Text style={styles.itemTitle}>Item #{item.item_no}</Text>
                </View>
                {item.material_grp && (
                    <View style={styles.materialGroupBadge}>
                        <Text style={styles.materialGroupText}>{item.material_grp}</Text>
                    </View>
                )}
            </View>

            {/* Material info */}
            <View style={styles.materialSection}>
                <View style={styles.materialRow}>
                    <MaterialCommunityIcons name="package-variant" size={18} color="#4b5563" />
                    <View style={styles.materialInfo}>
                        <Text style={styles.materialLabel}>Material</Text>
                        <Text style={styles.materialValue}>{item.material}</Text>
                    </View>
                </View>
                {item.short_text && (
                    <View style={styles.materialRow}>
                        <Ionicons name="document-text-outline" size={18} color="#4b5563" />
                        <View style={styles.materialInfo}>
                            <Text style={styles.materialLabel}>Description</Text>
                            <Text style={styles.materialDescription}>{item.short_text}</Text>
                        </View>
                    </View>
                )}
            </View>

            {/* Location */}
            <View style={styles.locationRow}>
                <View style={styles.locationItem}>
                    <View style={styles.locationLabelRow}>
                        <FontAwesome5 name="industry" size={12} color="#6b7280" />
                        <Text style={styles.locationLabel}>Plant</Text>
                    </View>
                    <Text style={styles.locationValue}>
                        {item.plant_name ?? "-"}
                    </Text>
                </View>
                <View style={styles.locationItem}>
                    <View style={styles.locationLabelRow}>
                        <Ionicons name="location-outline" size={14} color="#6b7280" />
                        <Text style={styles.locationLabel}>Storage</Text>
                    </View>
                    <Text style={styles.locationValue}>
                        {item.sloc ?? "-"}
                    </Text>
                </View>
            </View>

            {/* Quantity & Price */}
            <View style={styles.priceRow}>
                <View>
                    <Text style={styles.priceLabel}>Quantity</Text>
                    <View style={styles.quantityRow}>
                        <MaterialCommunityIcons name="cube-outline" size={18} color="#3b82f6" />
                        <Text style={styles.quantityValue}>{item.qty}</Text>
                    </View>
                </View>
                <View style={styles.priceSection}>
                    <Text style={styles.priceLabel}>Unit Price</Text>
                    <View style={styles.priceValueRow}>
                        <FontAwesome5 name="dollar-sign" size={14} color="#10b981" />
                        <Text style={styles.priceValue}>
                            {item.net_price} {item.currency}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Delivery date */}
            {item.deliv_date && (
                <View style={styles.deliverySection}>
                    <MaterialCommunityIcons name="truck-fast" size={16} color="#10b981" />
                    <Text style={styles.deliveryText}>
                        Delivery: {formatDeliveryDate(item.deliv_date)}
                    </Text>
                </View>
            )}
        </View>
    );
}
