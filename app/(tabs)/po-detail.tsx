import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { fetchPODetail, fetchPOHistory } from '../../../SAP-490/services/poService';

import LoadingScreen from '../../components/LoadingScreen';
import EmptyState from '../../components/EmptyState';

// ==== FORMATTER ====

function formatODataDate(odataDate?: string): string {
  if (!odataDate) return '-';
  const match = /\/Date\((\d+)\)\//.exec(odataDate);
  if (match?.[1]) return new Date(parseInt(match[1])).toLocaleDateString('vi-VN');
  return '-';
}

function formatSAPTime(time?: string): string {
  if (!time) return '-';
  const m = time.match(/PT(\d+)H(\d+)M(\d+)S/);
  if (!m) return time;
  return `${m[1].padStart(2, '0')}:${m[2].padStart(2, '0')}:${m[3].padStart(2, '0')}`;
}

export default function PODetailScreen() {
  const { po_id } = useLocalSearchParams<{ po_id: string }>();

  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [350, 0],
  });

  useEffect(() => {
    if (showHistory) {
      loadHistory();
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [showHistory]);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const result = await fetchPODetail(po_id);
        setDetail(result);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [po_id]);

  // ==== LOAD HISTORY ====
  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await fetchPOHistory(po_id);
      setHistory(res || []);
    } finally {
      setLoadingHistory(false);
    }
  };

  if (loading) return <LoadingScreen />;

  if (!detail)
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-gray-600">Không tìm thấy dữ liệu PO</Text>
      </SafeAreaView>
    );

  const items = detail?.to_Item?.results || [];

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['top', 'left', 'right']}>
      {/* ==== HEADER BG ==== */}
      <LinearGradient
        colors={['#1e40af', '#2563eb', '#3b82f6']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 192 }}
      />

      {/* ==== HEADER CONTENT ==== */}
      <LinearGradient
        colors={['#1e40af', '#2563eb', '#3b82f6']}
        style={{
          paddingHorizontal: 20,
          paddingTop: 48,
          paddingBottom: 24,
        }}>
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="rounded-full bg-white/20 px-3 py-2">
            <Ionicons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>

          <View className="ml-3 flex-1 flex-row items-center">
            <MaterialIcons name="receipt" size={24} color="white" />
            <Text className="ml-2 text-2xl font-extrabold text-white">PO {detail.po_id}</Text>
          </View>

          <View className="flex-row items-center rounded-xl bg-white/30 px-3 py-1">
            <MaterialIcons name="business" size={14} color="white" />
            <Text className="ml-1 font-semibold text-white">{detail.comp_code}</Text>
          </View>
        </View>

        <View className="mt-3 flex-row items-center">
          <Ionicons name="people" size={18} color="white" />
          <Text className="ml-2 text-lg font-semibold text-white">{detail.vendor_name}</Text>
        </View>

        <View className="mt-5 flex-row justify-between">
          {/* Purch Org */}
          <View>
            <Text className="text-xs text-white/70">Purch Org</Text>
            <Text className="font-semibold text-white">{detail.purch_org}</Text>
          </View>

          {/* Currency */}
          <View>
            <Text className="text-xs text-white/70">Currency</Text>
            <Text className="font-semibold text-white">{detail.currency}</Text>
          </View>

          {/* Doc Date */}
          <View>
            <Text className="text-xs text-white/70">Doc Date</Text>
            <Text className="font-semibold text-white">{formatODataDate(detail.doc_date)}</Text>
          </View>

          {/* Created */}
          <View>
            <Text className="text-xs text-white/70">Created By</Text>
            <Text className="font-semibold text-white">{detail.created_by}</Text>
          </View>
        </View>

        {/* TOTAL */}
        <View className="mt-6">
          <Text className="text-xs uppercase text-white/70">TOTAL AMOUNT</Text>
          <Text className="text-3xl font-extrabold text-green-300">
            {Number(detail.total_amount).toLocaleString('vi-VN')} {detail.currency}
          </Text>
        </View>

        {/* BUTTON: HISTORY */}
        <View className="mt-4">
          <TouchableOpacity
            onPress={() => setShowHistory(true)}
            className="flex-row items-center rounded-2xl bg-white/25 px-3 py-2">
            <Ionicons name="time-outline" size={18} color="#FFFFFF" />
            <Text className="ml-2 font-semibold text-white">History</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* ==== ITEMS ==== */}
      <ScrollView className="mt-4 flex-1">
        {items.length === 0 ? (
          <EmptyState icon="inventory" title="No Items Found" message="This PO has no items." />
        ) : (
          <>
            <View className="flex-row items-center justify-between px-5">
              <View className="flex-row items-center">
                <MaterialIcons name="inventory" size={22} color="#1F2937" />
                <Text className="ml-2 text-lg font-bold text-gray-800">Order Items</Text>
              </View>

              <View className="flex-row items-center rounded-xl bg-blue-100 px-3 py-1">
                <Ionicons name="cube" size={14} color="#1D4ED8" />
                <Text className="ml-1 text-xs font-semibold text-blue-700">
                  {items.length} items
                </Text>
              </View>
            </View>

            {items.map((item: any) => (
              <View
                key={item.item_no}
                className="mx-4 mb-1 mt-3 rounded-2xl border border-gray-200 bg-white p-4 shadow">
                {/* Item Header */}
                <View className="mb-2 flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View
                      className={
                        `rounded px-2 py-1 ` +
                        (item.del_item == 'L' ? 'bg-red-600' : 'bg-blue-600')
                      }>
                      <Text className="text-xs font-bold text-white">{item.item_no}</Text>
                    </View>

                    <Text className="ml-2 font-semibold text-gray-800">Item</Text>
                  </View>

                  <View className="flex-row items-center rounded-xl bg-purple-100 px-2 py-1">
                    <MaterialIcons name="category" size={12} color="#7C3AED" />
                    <Text className="ml-1 text-xs font-semibold text-purple-700">
                      {item.material_grp ?? '—'}
                    </Text>
                  </View>
                </View>

                {/* Material */}
                <View className="mt-2 flex-row items-center">
                  <MaterialIcons name="widgets" size={16} color="#374151" />
                  <Text className="ml-2 font-semibold text-gray-700">Material</Text>
                </View>
                <Text className="ml-6 text-gray-800">{item.material}</Text>

                {/* Description */}
                <View className="mt-2 flex-row items-center">
                  <Ionicons name="document-text" size={16} color="#374151" />
                  <Text className="ml-2 font-semibold text-gray-700">Description</Text>
                </View>
                <Text className="ml-6 text-gray-800">{item.short_text}</Text>

                {/* Plant + Sloc */}
                <View className="mt-3 flex-row justify-between">
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-700">Plant</Text>
                    <Text className="ml-5 text-gray-800">{item.plant_name}</Text>
                  </View>

                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-700">Storage</Text>
                    <Text className="ml-5 text-gray-800">{item.sloc}</Text>
                  </View>
                </View>

                {/* Qty + Price */}
                <View className="mt-3 flex-row justify-between">
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-700">Quantity</Text>
                    <Text className="ml-5 text-gray-800">{item.qty}</Text>
                  </View>

                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-700">Unit Price</Text>
                    <Text className="ml-5 font-bold text-green-600">
                      {Number(item.net_price).toLocaleString('vi-VN')} VND
                    </Text>
                  </View>
                </View>

                {/* Delivery */}
                <View className="mt-3 flex-row items-center rounded-xl bg-green-50 px-3 py-2">
                  <Ionicons name="checkmark-done-circle" size={18} color="#059669" />
                  <Text className="ml-2 text-sm font-semibold text-green-700">
                    Delivery: {formatODataDate(item.deliv_date)}
                  </Text>
                </View>
              </View>
            ))}

            <View className="h-20" />
          </>
        )}
      </ScrollView>

      {/* =====================================================
                  =======  HISTORY MODAL  =======
      ===================================================== */}
      {showHistory && (
        <View className="absolute inset-0">
          {/* Overlay fade */}
          <Animated.View style={[{ opacity: slideAnim }]} className="absolute inset-0 bg-black/40">
            <TouchableOpacity
              className="absolute inset-0"
              onPress={() => setShowHistory(false)}
              activeOpacity={1}
            />
          </Animated.View>

          {/* Bottom sheet */}
          <Animated.View
            style={[
              {
                transform: [{ translateY: translateY }],
              },
            ]}
            className="absolute bottom-0 left-0 right-0 max-h-[70%] rounded-t-3xl bg-white p-5">
            {/* Handle */}
            <View className="mb-3 items-center">
              <View className="h-1.5 w-12 rounded-full bg-gray-300" />
            </View>

            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-800">PO History</Text>
              <TouchableOpacity onPress={() => setShowHistory(false)}>
                <Ionicons name="close-circle" size={26} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Loading indicator */}
            {loadingHistory ? (
              <View className="items-center py-10">
                <ActivityIndicator size="large" color="#2563eb" />
                <Text className="mt-3 text-gray-600">Đang tải lịch sử...</Text>
              </View>
            ) : history.length === 0 ? (
              <Text className="py-4 text-center text-gray-500">No history found.</Text>
            ) : (
              <ScrollView className="pt-1">
                {history.map((h) => (
                  <View
                    key={h.LogId}
                    className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <Text className="text-sm font-bold text-blue-600">{h.Action}</Text>

                    <Text className="mt-1 text-xs text-gray-500">
                      Item: <Text className="font-semibold">{h.ItemNo}</Text>
                    </Text>

                    <Text className="text-xs text-gray-500">
                      Field: <Text className="font-semibold">{h.FieldLabel || h.FieldName}</Text>
                    </Text>

                    {(h.OldValue || h.NewValue) && (
                      <Text className="mt-1 text-xs text-gray-600">
                        {h.OldValue || '-'} → {h.NewValue || '-'}
                      </Text>
                    )}

                    <Text className="mt-2 text-xs text-gray-500">
                      User: <Text className="font-semibold">{h.Username}</Text>
                    </Text>

                    <Text className="text-xs text-gray-500">
                      Date:{' '}
                      <Text className="font-semibold">
                        {formatODataDate(h.ChangeDate)} {formatSAPTime(h.ChangeTime)}
                      </Text>
                    </Text>

                    {h.Note ? (
                      <Text className="mt-1 text-xs text-gray-700">📝 {h.Note}</Text>
                    ) : null}
                  </View>
                ))}
              </ScrollView>
            )}
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
}
