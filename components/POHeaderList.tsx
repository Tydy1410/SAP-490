import React, { forwardRef } from "react";
import { FlatList, View, Text, RefreshControl, Pressable } from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { headerListStyles as styles } from '../styles/headerList';

type Props = {
  data: any[];
  refreshing?: boolean;
  onRefresh?: () => void;
};

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

const POHeaderList = forwardRef<FlatList, Props>(({ data, refreshing = false, onRefresh }, ref) => {
  return (
    <FlatList
      ref={ref}
      data={data}
      keyExtractor={(item, idx) => item?.po_id ?? String(idx)}
      contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0a6ed1']}
            tintColor="#0a6ed1"
          />
        ) : undefined
      }
      renderItem={({ item }) => (
        <Link
          href={{
            pathname: "/po-detail",
            params: { po_id: item.po_id },
          }}
          asChild
        >
          <Pressable style={styles.card}>
            {/* Header Row */}
            <View style={styles.headerRow}>
              <View style={styles.headerLeft}>
                <View style={styles.poBadge}>
                  <Text style={styles.poBadgeText}>PO</Text>
                </View>
                <Text style={styles.poId} numberOfLines={1}>
                  {item.po_id}
                </Text>
              </View>
              <View style={styles.compCodeBadge}>
                <Text style={styles.compCodeText}>
                  {item.comp_code}
                </Text>
              </View>
            </View>

            {/* Vendor */}
            <View style={styles.vendorRow}>
              <MaterialCommunityIcons name="office-building" size={18} color="#4b5563" />
              <Text style={styles.vendorText} numberOfLines={1}>
                {item.vendor_name ?? item.vendor}
              </Text>
            </View>

            {/* Purchasing Org */}
            <View style={styles.purchOrgRow}>
              <MaterialCommunityIcons name="factory" size={16} color="#6b7280" />
              <Text style={styles.purchOrgText} numberOfLines={1}>
                {item.purch_org_name ?? item.purch_org}
              </Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Bottom Row: Amount + Date */}
            <View style={styles.bottomRow}>
              <View>
                <Text style={styles.amountLabel}>Total Amount</Text>
                <View style={styles.amountRow}>
                  <FontAwesome5 name="dollar-sign" size={14} color="#10b981" />
                  <Text style={styles.amountValue}>
                    {Number(item.total_amount || 0).toLocaleString("vi-VN")}
                  </Text>
                  <Text style={styles.currency}>{item.currency}</Text>
                </View>
              </View>

              <View style={styles.dateSection}>
                <View style={styles.dateLabelRow}>
                  <Ionicons name="calendar-outline" size={12} color="#6b7280" />
                  <Text style={styles.dateLabel}>Date</Text>
                </View>
                <Text style={styles.dateValue}>
                  {formatODataDate(item.doc_date)}
                </Text>
                <View style={styles.createdByRow}>
                  <Ionicons name="person-circle-outline" size={12} color="#9ca3af" />
                  <Text style={styles.createdBy}>
                    {item.created_by}
                  </Text>
                </View>
              </View>
            </View>

            {/* Status indicator */}
            <View style={styles.statusIndicator}>
              <View style={styles.statusDot} />
            </View>
          </Pressable>
        </Link>
      )}
    />
  );
});

export default POHeaderList;
