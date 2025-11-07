import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Animated } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchPODetail } from "../../SAP-490/services/poService";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import POItemCard from '../components/POItemCard';
import { commonStyles, gradientColors } from '../styles/common';
import { detailStyles } from '../styles/detail';

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
  const router = useRouter();
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const spinValue = React.useRef(new Animated.Value(0)).current;
  const pulseValue = React.useRef(new Animated.Value(1)).current;
  const shimmerValue = React.useRef(new Animated.Value(0)).current;

  // Animation for loading spinner - XỊN XÒ HƠN
  React.useEffect(() => {
    if (loading) {
      // Spin animation
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Shimmer animation
      Animated.loop(
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [loading]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const shimmerOpacity = shimmerValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 1, 0.6],
  });

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
      <LinearGradient
        colors={gradientColors.blue}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={commonStyles.loadingContainer}
      >
        <View style={commonStyles.loadingContent}>
          {/* Outer ring với pulse effect */}
          <Animated.View style={[
            commonStyles.loadingRing,
            {
              transform: [
                { rotate: spin },
                { scale: pulseValue }
              ]
            }
          ]}>
            {/* Inner ring quay ngược */}
            <Animated.View style={[
              commonStyles.loadingRingInner,
              {
                transform: [{ rotate: spin }],
                opacity: 0.6
              }
            ]} />
          </Animated.View>

          {/* Text với shimmer effect */}
          <View style={commonStyles.loadingTextContainer}>
            <Animated.Text style={[commonStyles.loadingTitle, { opacity: shimmerOpacity }]}>
              FA25SAP11
            </Animated.Text>

            {/* Animated dots */}
            <View style={commonStyles.loadingDots}>
              <Animated.View style={[commonStyles.loadingDot, { opacity: shimmerOpacity }]} />
              <Animated.View style={[commonStyles.loadingDot, { marginLeft: 8, opacity: shimmerOpacity }]} />
              <Animated.View style={[commonStyles.loadingDot, { marginLeft: 8, opacity: shimmerOpacity }]} />
            </View>
          </View>

          <Animated.Text style={[commonStyles.loadingSubtitle, { opacity: shimmerOpacity }]}>
            Loading PO {po_id}...
          </Animated.Text>
        </View>
      </LinearGradient>
    ); if (!detail)
    return (
      <View style={commonStyles.loadingContainer}>
        <Text style={detailStyles.errorText}>
          Không tìm thấy thông tin cho PO {po_id}
        </Text>
      </View>
    );

  const items = detail?.to_Item?.results || [];

  return (
    <SafeAreaView style={detailStyles.container} edges={['top']}>
      {/* COMPACT HEADER - Chỉ xanh ở dòng PO */}
      <LinearGradient
        colors={gradientColors.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={detailStyles.headerGradient}
      >
        <View style={detailStyles.headerTop}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={detailStyles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
            <Text style={detailStyles.headerTitle}>PO #{detail.po_id}</Text>
          </TouchableOpacity>
          <View style={detailStyles.compCodeBadge}>
            <Text style={detailStyles.compCodeText}>{detail.comp_code}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* WHITE INFO SECTION - Compact 2 cột */}
      <View style={detailStyles.infoSection}>
        {/* Vendor */}
        <View style={detailStyles.infoRow}>
          <MaterialCommunityIcons name="office-building" size={20} color="#3b82f6" />
          <View style={detailStyles.infoContent}>
            <Text style={detailStyles.infoLabel}>Vendor</Text>
            <Text style={detailStyles.infoValue} numberOfLines={1}>
              {detail.vendor_name ?? detail.vendor}
            </Text>
          </View>
        </View>

        {/* 2 columns grid */}
        <View style={detailStyles.gridRow}>
          <View style={detailStyles.gridItem}>
            <MaterialCommunityIcons name="factory" size={18} color="#6b7280" />
            <View style={detailStyles.gridContent}>
              <Text style={detailStyles.gridLabel}>Purch Org</Text>
              <Text style={detailStyles.gridValue}>{detail.purch_org}</Text>
            </View>
          </View>

          <View style={detailStyles.gridItem}>
            <FontAwesome5 name="coins" size={16} color="#6b7280" />
            <View style={detailStyles.gridContent}>
              <Text style={detailStyles.gridLabel}>Currency</Text>
              <Text style={detailStyles.gridValue}>{detail.currency}</Text>
            </View>
          </View>
        </View>

        <View style={detailStyles.gridRow}>
          <View style={detailStyles.gridItem}>
            <Ionicons name="calendar-outline" size={18} color="#6b7280" />
            <View style={detailStyles.gridContent}>
              <Text style={detailStyles.gridLabel}>Doc Date</Text>
              <Text style={detailStyles.gridValue}>{formatODataDate(detail.doc_date)}</Text>
            </View>
          </View>

          <View style={detailStyles.gridItem}>
            <Ionicons name="person-outline" size={18} color="#6b7280" />
            <View style={detailStyles.gridContent}>
              <Text style={detailStyles.gridLabel}>Created By</Text>
              <Text style={detailStyles.gridValue}>{detail.created_by}</Text>
            </View>
          </View>
        </View>

        {/* Total Amount - Full width */}
        <View style={detailStyles.totalSection}>
          <Text style={detailStyles.totalLabel}>Total Amount</Text>
          <View style={detailStyles.totalRow}>
            <FontAwesome5 name="dollar-sign" size={20} color="#10b981" />
            <Text style={detailStyles.totalAmount}>
              {Number(detail.total_amount || 0).toLocaleString("vi-VN")}
            </Text>
            <Text style={detailStyles.totalCurrency}>{detail.currency}</Text>
          </View>
        </View>

        {/* Items count */}
        <View style={detailStyles.itemsCountRow}>
          <Text style={detailStyles.itemsCountLabel}>Order Items</Text>
          <View style={detailStyles.itemsCountBadge}>
            <Text style={detailStyles.itemsCountText}>{items.length} items</Text>
          </View>
        </View>
      </View>

      {/* ITEM LIST - 2/3 màn hình để scroll */}
      <FlatList
        data={items}
        keyExtractor={(i) => `${i.po_number}-${i.item_no}`}
        contentContainerStyle={detailStyles.listContent}
        renderItem={({ item }) => <POItemCard item={item} />}
      />
    </SafeAreaView>
  );
}
