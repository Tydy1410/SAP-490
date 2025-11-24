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
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

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
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.80;

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

  function formatSAPTime(time?: string) {
    if (!time) return '-';
    const m = time.match(/PT(\d+)H(\d+)M(\d+)S/);
    return m ? `${m[1].padStart(2, '0')}:${m[2].padStart(2, '0')}:${m[3].padStart(2, '0')}` : '-';
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
    <View className="flex-1 items-center justify-center px-6">
      <View className="mb-4 rounded-full bg-gray-100 p-6">
        <Ionicons name="folder-open-outline" size={48} color="#9CA3AF" />
      </View>
      <Text className="text-base font-semibold text-gray-500">No Data Found</Text>
      <Text className="mt-1 text-center text-sm text-gray-400">
        No {activeTab === 'history' ? 'history' : activeTab === 'goods' ? 'goods receipt' : 'invoice'} records available
      </Text>
    </View>
  );

  // ---------------------------- RENDER DATA ----------------------------
  const renderContent = () => {
    if (selected.loading)
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="mt-3 text-gray-600">Loading...</Text>
        </View>
      );

    if (!selected.data?.length) return renderEmpty();

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 200, paddingHorizontal: 20 }}>
        {selected.data.map((item: any, i: number) => {
          const cardColor = activeTab === 'invoice' ? 'bg-emerald-50' : activeTab === 'goods' ? 'bg-blue-50' : 'bg-orange-50';
          const borderColor = activeTab === 'invoice' ? 'border-emerald-200' : activeTab === 'goods' ? 'border-blue-200' : 'border-orange-200';
          const iconColor = activeTab === 'invoice' ? '#10B981' : activeTab === 'goods' ? '#3B82F6' : '#F97316';
          const iconBg = activeTab === 'invoice' ? 'bg-emerald-100' : activeTab === 'goods' ? 'bg-blue-100' : 'bg-orange-100';
          const isLastItem = i === selected.data.length - 1;

          return (
            <View
              key={i}
              className={`${isLastItem ? 'mb-8' : 'mb-4'} rounded-2xl border ${borderColor} ${cardColor} overflow-hidden shadow-lg`}>
              {/* Header với gradient */}
              <View className={`flex-row items-center justify-between px-4 py-3 ${activeTab === 'invoice' ? 'bg-emerald-100/50' : activeTab === 'goods' ? 'bg-blue-100/50' : 'bg-orange-100/50'}`}>
                <View className="flex-row items-center flex-1">
                  <View className={`mr-3 rounded-full ${iconBg} p-2`}>
                    <Ionicons
                      name={activeTab === 'invoice' ? 'document-text' : activeTab === 'goods' ? 'cube' : 'time'}
                      size={20}
                      color={iconColor}
                    />
                  </View>
                  <Text className="flex-1 text-base font-bold text-gray-900" numberOfLines={1}>
                    {activeTab === 'invoice'
                      ? `Invoice ${item.SupplierInvoice}`
                      : activeTab === 'goods'
                        ? `Material Doc ${item.MaterialDocument}`
                        : item.Action}
                  </Text>
                </View>
                <View className={`rounded-full ${iconBg} px-2.5 py-1`}>
                  <Text className="text-xs font-semibold" style={{ color: iconColor }}>
                    #{i + 1}
                  </Text>
                </View>
              </View>

              {/* Content */}
              <View className="px-4 py-4">
                {activeTab === 'invoice'
                  ? renderInvoice(item)
                  : activeTab === 'goods'
                    ? renderGoods(item)
                    : renderHistory(item)}
              </View>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  // ---------------------------- RENDER INVOICE ----------------------------
  const renderInvoice = (item: any) => (
    <>
      <View className="mb-3">
        <InfoRow icon="document-text-outline" label="Invoice No" value={item.SupplierInvoice} valueColor="text-gray-900" valueBold />
        <InfoRow icon="calendar-outline" label="Fiscal Year" value={item.FiscalYear} />
      </View>

      <View className="mb-3 rounded-xl bg-white p-3">
        <InfoRow icon="receipt-outline" label="Purchase Order" value={item.PurchaseOrder} valueBold />
        <InfoRow icon="pricetag-outline" label="PO Item" value={item.PurchaseOrderItem} />
      </View>

      <View className="mb-3 rounded-xl bg-white p-3">
        <InfoRow icon="layers-outline" label="Quantity" value={Number(item.QuantityInPurchaseOrderUnit).toString()} valueBold />
        <InfoRow icon="apps" label="Order Unit" value={item.PurchaseOrderQtyUnitSAPCode || '-'} />
      </View>

      <View className="rounded-xl bg-emerald-500 p-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="cash" size={24} color="white" />
            <Text className="ml-2 text-sm font-semibold text-white">Total Amount</Text>
          </View>
          <Text className="text-lg font-bold text-white">
            {Number(item.SupplierInvoiceItemAmount).toLocaleString()} {item.DocumentCurrency}
          </Text>
        </View>
      </View>

      {item.SuplrInvcDeliveryCostCndnCount ? (
        <View className="mt-3">
          <InfoRow icon="cube-outline" label="Delivery Cost Qty" value={item.SuplrInvcDeliveryCostCndnCount} />
        </View>
      ) : null}
    </>
  );

  // ---------------------------- RENDER GOODS ----------------------------
  const renderGoods = (item: any) => (
    <>
      <View className="mb-3">
        <InfoRow icon="document-outline" label="Material Document" value={item.MaterialDocument} valueColor="text-gray-900" valueBold />
        <InfoRow icon="calendar" label="Posting Date" value={formatODataDate(item.PostingDate)} />
        {item.AccountingDocumentType ? (
          <InfoRow icon="document-text-outline" label="Short Text" value={item.AccountingDocumentType} />
        ) : null}
      </View>

      <View className="mb-3 rounded-xl bg-white p-3">
        <InfoRow icon="swap-horizontal" label="Movement Type" value={item.GoodsMovementType} />
        <InfoRow icon="cube" label="Quantity" value={Number(item.GoodsReceiptQtyInOrderUnit).toString()} valueBold />
      </View>

      <View className="mb-3 rounded-xl bg-blue-500 p-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="cash-outline" size={24} color="white" />
            <Text className="ml-2 text-sm font-semibold text-white">Amount</Text>
          </View>
          <Text className="text-lg font-bold text-white">
            {Number(item.TotalGoodsMvtAmtInCCCrcy).toLocaleString()} {item.CompanyCodeCurrency}
          </Text>
        </View>
      </View>

      <View className="rounded-xl bg-white p-3">
        <Text className="mb-2 text-xs font-semibold uppercase text-gray-500">Location Info</Text>
        <InfoRow icon="business" label="Plant" value={item.Plant} />
        <InfoRow icon="location" label="Storage Location" value={item.StorageLocation} />
        <InfoRow icon="barcode" label="Batch" value={item.Batch || '-'} valueColor={item.Batch ? 'text-gray-800' : 'text-gray-400'} />
      </View>
    </>
  );

  // ---------------------------- RENDER HISTORY ----------------------------
  const renderHistory = (item: any) => {
    const action = item.Action?.toLowerCase() || '';
    const newValue = item.NewValue?.toLowerCase() || '';
    const oldValue = item.OldValue?.toLowerCase() || '';

    const isCreate = action.includes('create') || action.includes('add') ||
      newValue.includes('created') || oldValue === '' || oldValue === '-';
    const isDelete = action.includes('delete') || action.includes('remove') ||
      newValue.includes('deleted') || newValue === 'x';

    // CREATE ITEM
    if (isCreate) {
      return (
        <>
          <View className="mb-3 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="mr-2 rounded-full bg-green-100 px-3 py-1">
                <Text className="text-xs font-bold text-green-700">Item {item.ItemNo}</Text>
              </View>
              <View className="rounded-full bg-green-500 px-2 py-0.5">
                <Text className="text-xs font-bold text-white">NEW</Text>
              </View>
            </View>
          </View>

          <View className="rounded-xl bg-green-50 border border-green-200 p-4">
            <View className="flex-row items-center mb-3">
              <View className="rounded-full bg-green-500 p-2">
                <Ionicons name="add-circle" size={20} color="white" />
              </View>
              <Text className="ml-3 text-base font-bold text-green-800">Item Created</Text>
            </View>

            {item.Note ? (
              <View className="rounded-lg bg-white p-3 mb-3">
                <Text className="text-sm text-gray-700">{item.Note}</Text>
              </View>
            ) : null}

            {/* User & DateTime */}
            <View className="flex-row items-center justify-between border-t border-green-200 pt-3">
              <View className="flex-row items-center flex-1">
                <Ionicons name="person" size={16} color="#059669" />
                <Text className="ml-2 text-xs font-semibold text-gray-700">{item.Username}</Text>
              </View>

              <View className="flex-row items-center ml-3">
                <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
                <Text className="ml-1 text-xs text-gray-600">{formatODataDate(item.ChangeDate)}</Text>
              </View>

              <View className="flex-row items-center ml-2">
                <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                <Text className="ml-1 text-xs text-gray-600">{formatSAPTime(item.ChangeTime)}</Text>
              </View>
            </View>
          </View>
        </>
      );
    }

    // DELETE ITEM
    if (isDelete) {
      return (
        <>
          <View className="mb-3 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="mr-2 rounded-full bg-red-100 px-3 py-1">
                <Text className="text-xs font-bold text-red-700">Item {item.ItemNo}</Text>
              </View>
              <View className="rounded-full bg-red-500 px-2 py-0.5">
                <Text className="text-xs font-bold text-white">DELETED</Text>
              </View>
            </View>
          </View>

          <View className="rounded-xl bg-red-50 border border-red-200 p-4">
            <View className="flex-row items-center mb-3">
              <View className="rounded-full bg-red-500 p-2">
                <Ionicons name="trash" size={20} color="white" />
              </View>
              <Text className="ml-3 text-base font-bold text-red-800">Item Deleted</Text>
            </View>

            {item.Note ? (
              <View className="rounded-lg bg-white p-3 mb-3">
                <Text className="text-sm text-gray-700">{item.Note}</Text>
              </View>
            ) : null}

            {/* User & DateTime */}
            <View className="flex-row items-center justify-between border-t border-red-200 pt-3">
              <View className="flex-row items-center flex-1">
                <Ionicons name="person" size={16} color="#DC2626" />
                <Text className="ml-2 text-xs font-semibold text-gray-700">{item.Username}</Text>
              </View>

              <View className="flex-row items-center ml-3">
                <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
                <Text className="ml-1 text-xs text-gray-600">{formatODataDate(item.ChangeDate)}</Text>
              </View>

              <View className="flex-row items-center ml-2">
                <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                <Text className="ml-1 text-xs text-gray-600">{formatSAPTime(item.ChangeTime)}</Text>
              </View>
            </View>
          </View>
        </>
      );
    }

    // CHANGE ITEM (default)
    return (
      <>
        {/* Header with Action */}
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className="mr-2 rounded-full bg-orange-100 px-3 py-1">
              <Text className="text-xs font-bold text-orange-700">Item {item.ItemNo}</Text>
            </View>
            {item.Note ? (
              <Text className="text-xs italic text-gray-500" numberOfLines={1}>{item.Note}</Text>
            ) : null}
          </View>
        </View>

        {/* Field Label */}
        <View className="mb-3 rounded-xl bg-white p-3">
          <View className="flex-row items-center">
            <Ionicons name="pencil" size={16} color="#F97316" />
            <Text className="ml-2 text-sm font-semibold text-gray-700">{item.FieldLabel || item.FieldName}</Text>
          </View>

          {/* Old Value -> New Value */}
          <View className="mt-3 flex-row items-center">
            <View className="flex-1 rounded-lg bg-red-50 p-2.5">
              <Text className="text-xs text-gray-500">Old Value</Text>
              <Text className="mt-1 font-bold text-red-700">{item.OldValue || '-'}</Text>
            </View>

            <View className="mx-2">
              <Ionicons name="arrow-forward" size={20} color="#F97316" />
            </View>

            <View className="flex-1 rounded-lg bg-green-50 p-2.5">
              <Text className="text-xs text-gray-500">New Value</Text>
              <Text className="mt-1 font-bold text-green-700">{item.NewValue || '-'}</Text>
            </View>
          </View>
        </View>

        {/* User & DateTime */}
        <View className="rounded-xl bg-orange-50 p-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Ionicons name="person" size={16} color="#F97316" />
              <Text className="ml-2 text-xs font-semibold text-gray-700">{item.Username}</Text>
            </View>

            <View className="flex-row items-center ml-3">
              <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
              <Text className="ml-1 text-xs text-gray-600">{formatODataDate(item.ChangeDate)}</Text>
            </View>

            <View className="flex-row items-center ml-2">
              <Ionicons name="time-outline" size={14} color="#9CA3AF" />
              <Text className="ml-1 text-xs text-gray-600">{formatSAPTime(item.ChangeTime)}</Text>
            </View>
          </View>
        </View>
      </>
    );
  };

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
        <View className="mb-3 flex-row justify-around px-4">
          {(['history', 'goods', 'invoice'] as TabType[]).map((t) => {
            const isActive = activeTab === t;

            return (
              <TouchableOpacity
                key={t}
                onPress={() => setActiveTab(t)}
                className={`flex-1 items-center rounded-xl py-2.5 mx-1 ${isActive
                  ? t === 'invoice'
                    ? 'bg-emerald-100'
                    : t === 'goods'
                      ? 'bg-blue-100'
                      : 'bg-orange-100'
                  : 'bg-gray-50'
                  }`}>
                <View className="flex-row items-center">
                  <Ionicons
                    name={t === 'invoice' ? 'document-text' : t === 'goods' ? 'cube' : 'time'}
                    size={18}
                    color={isActive
                      ? t === 'invoice' ? '#10B981' : t === 'goods' ? '#3B82F6' : '#F97316'
                      : '#9CA3AF'
                    }
                  />
                  <Text
                    className={`ml-1.5 text-sm font-bold ${isActive
                      ? t === 'invoice' ? 'text-emerald-600' : t === 'goods' ? 'text-blue-600' : 'text-orange-600'
                      : 'text-gray-400'
                      }`}>
                    {t === 'history' ? 'History' : t === 'goods' ? 'Goods' : 'Invoice'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Content (flex-1 để scroll không đẩy modal) */}
        <View className="flex-1">{renderContent()}</View>
      </Animated.View>
    </View>
  );
}

/* ---------------------------- Reusable components ---------------------------- */

const InfoRow = ({ icon, label, value, valueColor = 'text-gray-800', valueBold = false }: any) => (
  <View className="mt-2 flex-row items-center justify-between">
    <View className="flex-row items-center flex-1">
      <Ionicons name={icon} size={16} color="#6B7280" />
      <Text className="ml-2 text-xs text-gray-500">{label}</Text>
    </View>
    <Text className={`ml-2 text-xs ${valueBold ? 'font-bold' : 'font-medium'} ${valueColor}`} numberOfLines={1}>
      {value}
    </Text>
  </View>
);
