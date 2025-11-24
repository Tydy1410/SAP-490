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
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import POExtraInfoModal from '../../components/POExtraInfoModal';

import { fetchPODetail, fetchPOHistory } from '../../../SAP-490/services/poService';

import { fetchPOGoodsReceipt, fetchPOInvoice } from '../../services/poService';

import LoadingScreen from '../../components/LoadingScreen';
import EmptyState from '../../components/EmptyState';

// ===== FORMATTERS =====
function formatODataDate(dt?: string) {
  if (!dt) return '-';
  const m = /\/Date\((\d+)\)\//.exec(dt);
  return m ? new Date(parseInt(m[1])).toLocaleDateString('vi-VN') : '-';
}

function formatSAPTime(time?: string) {
  if (!time) return '-';
  const m = time.match(/PT(\d+)H(\d+)M(\d+)S/);
  return m ? `${m[1].padStart(2, '0')}:${m[2].padStart(2, '0')}:${m[3].padStart(2, '0')}` : '-';
}

export default function PODetailScreen() {
  const { po_id } = useLocalSearchParams<{ po_id: string }>();

  // ========== DETAIL ==========
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ========== MODAL ==========
  const [showExtra, setShowExtra] = useState(false);
  const [activeTab, setActiveTab] = useState<'history' | 'goods' | 'invoice'>('history');

  // ========== DATA ==========
  const [history, setHistory] = useState<any[]>([]);
  const [goodsReceipt, setGoodsReceipt] = useState<any[]>([]);
  const [invoice, setInvoice] = useState<any[]>([]);

  // ========== LOADING ==========
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingGR, setLoadingGR] = useState(false);
  const [loadingInvoice, setLoadingInvoice] = useState(false);

  // =====================================================
  //                     LOAD DETAIL
  // =====================================================
  useEffect(() => {
    const loadDetail = async () => {
      const res = await fetchPODetail(po_id);
      setDetail(res);
      setLoading(false);
    };
    loadDetail();
  }, [po_id]);

  // =====================================================
  //               LOAD HISTORY / GR / INVOICE
  // =====================================================
  const loadHistory = async () => {
    setLoadingHistory(true);
    const res = await fetchPOHistory(po_id);
    setHistory(res || []);
    setLoadingHistory(false);
  };

  const loadGoodsReceipt = async () => {
    setLoadingGR(true);
    const res = await fetchPOGoodsReceipt(po_id);
    setGoodsReceipt(res || []);
    setLoadingGR(false);
  };

  const loadInvoice = async () => {
    setLoadingInvoice(true);
    const res = await fetchPOInvoice(po_id);
    setInvoice(res || []);
    setLoadingInvoice(false);
  };

  // =====================================================
  //                     RENDER
  // =====================================================
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
      {/* BG */}
      <LinearGradient
        colors={['#1e40af', '#2563eb', '#3b82f6']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 192 }}
      />

      {/* HEADER */}
      <LinearGradient
        colors={['#1e40af', '#2563eb', '#3b82f6']}
        style={{ paddingHorizontal: 20, paddingTop: 48, paddingBottom: 24 }}>
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

        {/* INFO */}
        <View className="mt-5 flex-row justify-between">
          <View>
            <Text className="text-xs text-white/70">Purch Org</Text>
            <Text className="font-semibold text-white">{detail.purch_org}</Text>
          </View>

          <View>
            <Text className="text-xs text-white/70">Currency</Text>
            <Text className="font-semibold text-white">{detail.currency}</Text>
          </View>

          <View>
            <Text className="text-xs text-white/70">Doc Date</Text>
            <Text className="font-semibold text-white">{formatODataDate(detail.doc_date)}</Text>
          </View>

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

        {/* ACTION BUTTONS */}
        <View className="mt-4 flex-row gap-3">
          {/** NÚT DÙNG CHUNG LOGIC */}
          {[
            { key: 'history', icon: 'time-outline', label: 'History' },
            { key: 'goods', icon: 'cube', label: 'Goods' },
            { key: 'invoice', icon: 'document-text-outline', label: 'Invoice' },
          ].map((t) => (
            <TouchableOpacity
              key={t.key}
              onPress={async () => {
                setShowExtra(true);
                setActiveTab(t.key as any);

                // fetch all 3 song song
                setLoadingHistory(true);
                setLoadingGR(true);
                setLoadingInvoice(true);

                const [h, g, i] = await Promise.all([
                  fetchPOHistory(po_id),
                  fetchPOGoodsReceipt(po_id),
                  fetchPOInvoice(po_id),
                ]);

                setHistory(h || []);
                setGoodsReceipt(g || []);
                setInvoice(i || []);

                setLoadingHistory(false);
                setLoadingGR(false);
                setLoadingInvoice(false);
              }}
              className="flex-row items-center rounded-2xl bg-white/25 px-4 py-2.5">
              <Ionicons name={t.icon as any} size={18} color="white" />
              <Text className="ml-2 font-semibold text-white">{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {/* ===== ITEMS ===== */}
      <ScrollView className="mt-4 flex-1">
        {items.length === 0 ? (
          <EmptyState icon="inventory" title="No Items Found" message="This PO has no items." />
        ) : (
          items.map((item: any) => (
            <View
              key={item.item_no}
              className="mx-4 mb-5 rounded-3xl border border-gray-100 bg-white p-5 shadow-md">
              {/* ===== HEADER ===== */}
              <View className="mb-4 flex-row items-center justify-between">
                {/* LEFT */}
                <View className="flex-row items-center">
                  {/* ITEM BADGE */}
                  <View
                    className={`mr-2 rounded-full px-3 py-1 ${item.del_item === 'L' ? 'bg-red-600' : 'bg-blue-600'
                      }`}>
                    <Text className="text-xs font-bold text-white">{item.item_no}</Text>
                  </View>

                  <Text className="text-lg font-semibold text-gray-900">Item</Text>

                  {/* DELETED ICON */}
                  {item.del_item === 'L' ? (
                    <Ionicons name="trash" size={20} color="#DC2626" style={{ marginLeft: 8 }} />
                  ) : (
                    <Ionicons name="checkmark-circle" size={20} color="#10B981" style={{ marginLeft: 8 }} />
                  )}
                </View>

                {/* RIGHT BADGE (material group) */}
                <View className="flex-row items-center rounded-xl bg-indigo-50 px-3 py-1">
                  <Ionicons name="pricetag" size={14} color="#4F46E5" />
                  <Text className="ml-1 text-xs font-semibold text-indigo-700">
                    {item.material_grp ?? '—'}
                  </Text>
                </View>
              </View>

              {/* ===== MATERIAL CODE ===== */}
              <View className="flex-row items-center">
                <MaterialIcons name="qr-code" size={18} color="#4B5563" />
                <Text className="ml-2 text-base font-bold text-gray-900">{item.material}</Text>
              </View>

              {/* ===== DESCRIPTION ===== */}
              <View className="mt-2 flex-row items-center">
                <Ionicons name="document-text-outline" size={18} color="#6B7280" />
                <Text className="ml-2 flex-1 text-[15px] leading-5 text-gray-700">
                  {item.short_text}
                </Text>
              </View>

              {/* ===== PLANT / STORAGE ===== */}
              <View className="mt-5 flex-row justify-between">
                {/* PLANT */}
                <View className="flex-1">
                  <Text className="text-xs text-gray-500">Plant</Text>
                  <Text className="mt-1 font-semibold leading-5 text-gray-900">
                    {item.plant_name}
                  </Text>
                </View>

                {/* STORAGE */}
                <View className="flex-1">
                  <Text className="text-xs text-gray-500">Storage</Text>
                  <Text className="mt-1 font-semibold text-gray-900">{item.sloc}</Text>
                </View>
              </View>

              {/* ===== QUANTITY + PRICE ===== */}
              <View className="mt-6 flex-row items-end justify-between">
                {/* QTY */}
                <View>
                  <Text className="text-xs text-gray-500">Quantity</Text>
                  <Text className="mt-1 text-[16px] font-semibold text-gray-900">{Number(item.qty).toString()}</Text>
                </View>

                {/* PRICE */}
                <View className="items-end">
                  <Text className="text-xs text-gray-500">Unit Price</Text>
                  <Text className="mt-1 text-[17px] font-extrabold text-green-600">
                    {Number(item.net_price).toLocaleString('vi-VN')} VND
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}

        <View className="h-20" />
      </ScrollView>

      {/* =====================================================
                  === EXTRA INFO MODAL (3 TAB) ===
      ===================================================== */}
      <POExtraInfoModal
        visible={showExtra}
        onClose={() => setShowExtra(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        history={history}
        goodsReceipt={goodsReceipt}
        invoice={invoice}
        loadingHistory={loadingHistory}
        loadingGR={loadingGR}
        loadingInvoice={loadingInvoice}
      />
    </SafeAreaView>
  );
}
