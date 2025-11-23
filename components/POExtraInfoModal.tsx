import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';

type TabType = 'history' | 'goods' | 'invoice';

type ModalProps = {
  visible: boolean;
  onClose: () => void;
  activeTab: TabType;
  setActiveTab: (t: TabType) => void;
  history: any[];
  goodsReceipt: any[];
  invoice: any[];
  loadingHistory: boolean;
  loadingGR: boolean;
  loadingInvoice: boolean;
};

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.72;

export default function POExtraInfoModal({
  visible,
  onClose,
  activeTab,
  setActiveTab,
  history,
  goodsReceipt,
  invoice,
  loadingHistory,
  loadingGR,
  loadingInvoice,
}: ModalProps) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // ---------------------------- DATE FORMAT ----------------------------
  function formatODataDate(dt?: string) {
    if (!dt) return '-';
    const m = /\/Date\((\d+)\)\//.exec(dt);
    return m ? new Date(parseInt(m[1])).toLocaleDateString('vi-VN') : '-';
  }

  // ---------------------------- ANIM ----------------------------
  const openSheet = () =>
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT - SHEET_HEIGHT,
      duration: 260,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

  const closeSheet = () =>
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 220,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(onClose);

  useEffect(() => {
    visible ? openSheet() : closeSheet();
  }, [visible]);

  if (!visible) return null;

  // ---------------------------- SELECT DATA ----------------------------
  const selected = {
    history: { loading: loadingHistory, data: history },
    goods: { loading: loadingGR, data: goodsReceipt },
    invoice: { loading: loadingInvoice, data: invoice },
  }[activeTab];

  // ---------------------------- RENDER EMPTY ----------------------------
  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center">
      <Text className="text-sm text-gray-400">Không có dữ liệu</Text>
    </View>
  );

  // ---------------------------- RENDER DATA ----------------------------
  const renderContent = () => {
    if (selected.loading)
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="mt-3 text-gray-600">Đang tải...</Text>
        </View>
      );

    if (!selected.data?.length) return renderEmpty();

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}>
        {selected.data.map((item: any, i: number) => (
          <View
            key={i}
            className="mb-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-5 shadow-sm">
            <Text className="mb-2 text-base font-bold text-gray-900">
              {activeTab === 'invoice'
                ? `Invoice ${item.SupplierInvoice}`
                : activeTab === 'goods'
                  ? `Material Doc ${item.MaterialDocument}`
                  : item.Action}
            </Text>

            {activeTab === 'invoice'
              ? renderInvoice(item)
              : activeTab === 'goods'
                ? renderGoods(item)
                : renderHistory(item)}
          </View>
        ))}
      </ScrollView>
    );
  };

  // ---------------------------- RENDER INVOICE ----------------------------
  const renderInvoice = (item: any) => (
    <>
      <Row label="Invoice No" value={item.SupplierInvoice} bold />
      <Row label="Fiscal Year" value={item.FiscalYear} />
      <Row label="Purchase Order" value={item.PurchaseOrder} bold />
      <Row label="PO Item" value={item.PurchaseOrderItem} />

      <Divider />

      <Row
        label="Quantity"
        value={`${item.QuantityInPurchaseOrderUnit} ${item.PurchaseOrderQuantityUnit}`}
      />
      <Row label="Price Unit" value={item.PurchaseOrderPriceUnit} />

      <Row
        label="Amount"
        value={`${Number(item.SupplierInvoiceItemAmount).toLocaleString()} ${
          item.DocumentCurrency
        }`}
        bold
      />

      <Row label="Deliv. Cost Qty" value={item.SuplrInvcDeliveryCostCndnCount} />
    </>
  );

  // ---------------------------- RENDER GOODS ----------------------------
  const renderGoods = (item: any) => (
    <>
      <Row label="Material Document" value={item.MaterialDocument} bold />
      <Row label="Posting Date" value={formatODataDate(item.PostingDate)} />

      <Divider />

      <Row label="Movement Type" value={item.GoodsMovementType} />
      <Row
        label="Quantity"
        value={`${item.GoodsReceiptQtyInOrderUnit} ${item.MaterialBaseUnit}`}
        bold
      />
      <Row label="Order Unit" value={item.MaterialBaseUnit} />

      <Row
        label="Amount"
        value={`${Number(item.TotalGoodsMvtAmtInCCCrcy).toLocaleString()} ${
          item.CompanyCodeCurrency
        }`}
        bold
      />

      <Divider />

      <Row label="Plant" value={item.Plant} />
      <Row label="Storage Loc" value={item.StorageLocation} />
      <Row label="Batch" value={item.Batch || '-'} />
    </>
  );

  // ---------------------------- RENDER HISTORY ----------------------------
  const renderHistory = (item: any) => (
    <>
      <Row label="Item" value={item.ItemNo} />
      <Row label="Field" value={item.FieldLabel} />
      <Text className="mt-1 text-xs text-gray-700">
        {item.OldValue || '-'} → {item.NewValue || '-'}
      </Text>
    </>
  );

  // ---------------------------- UI STRUCTURE ----------------------------
  return (
    <View className="absolute inset-0 z-50">
      {/* Overlay */}
      <TouchableOpacity className="absolute inset-0 bg-black/40" onPress={closeSheet} />

      {/* Sheet */}
      <Animated.View
        style={{
          transform: [{ translateY }],
          height: SHEET_HEIGHT,
        }}
        className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white shadow-2xl">
        {/* Handle */}
        <View className="mb-3 mt-3 items-center">
          <View className="h-1.5 w-16 rounded-full bg-gray-400 opacity-70" />
        </View>

        {/* Tabs */}
        <View className="mb-1 flex-row justify-around px-5">
          {(['history', 'goods', 'invoice'] as TabType[]).map((t) => (
            <TouchableOpacity key={t} onPress={() => setActiveTab(t)}>
              <Text
                className={`text-base font-semibold ${
                  activeTab === t ? 'text-blue-600' : 'text-gray-400'
                }`}>
                {t === 'history' ? 'History' : t === 'goods' ? 'Goods' : 'Invoice'}
              </Text>

              {activeTab === t && <View className="mt-1 h-1 rounded-full bg-blue-600" />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Content (flex-1 để scroll không đẩy modal) */}
        <View className="flex-1 px-5">{renderContent()}</View>
      </Animated.View>
    </View>
  );
}

/* ---------------------------- Reusable components ---------------------------- */

const Row = ({ label, value, bold }: any) => (
  <View className="mt-1 flex-row justify-between">
    <Text className="text-xs text-gray-500">{label}:</Text>
    <Text className={`text-xs ${bold ? 'font-bold text-gray-900' : 'text-gray-700'}`}>{value}</Text>
  </View>
);

const Divider = () => <View className="my-2 h-[1px] bg-gray-300" />;
