import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, TextInput, Modal } from 'react-native';
import { fetchPOHeaders } from '../services/poService';
import POHeaderList from '../components/POHeaderList';
import '../global.css';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [searchPO, setSearchPO] = useState(''); // search PO ID
  const [filterVisible, setFilterVisible] = useState(false);

  const [filters, setFilters] = useState({
    comp_code: '',
    vendor: '',
    purch_org: '',
    po_id: '',
  });

  const pageSize = 40;
  const listRef = useRef<any>(null);

  const loadData = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await fetchPOHeaders(pageNum, pageSize, {
        ...filters,
        po_id: searchPO,
      });

      setData(res);
      setHasMore(res.length === pageSize);

      listRef.current?.scrollToOffset?.({ offset: 0, animated: true });
    } catch (err) {
      console.error('❌ Lỗi load PO:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(page);
  }, [page]);

  const applySearch = () => {
    setPage(1);
    loadData(1);
  };

  if (loading)
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#0a6ed1" />
        <Text className="mt-3 text-gray-600">Đang tải danh sách các PO ...</Text>
      </View>
    );

  return (
    <View className="flex-1 bg-gray-100">
      {/* ✅ TOP APP BAR */}
      <View className="flex-row items-center justify-between bg-blue-600 px-4 py-3 shadow-md">
        <Text className="text-lg font-semibold text-white">Purchase Orders</Text>

        <View className="flex-row space-x-5">
          {/* Filter icon */}
          <TouchableOpacity onPress={() => setFilterVisible(true)}>
            <Text className="ml-3 text-3xl text-white">☰</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ✅ SEARCH BAR PO ID */}
      <View className="relative w-full">
        <TextInput
          className="rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 shadow-sm"
          placeholder="Search PO ID..."
          value={searchPO}
          onChangeText={setSearchPO}
        />

        {/* ✅ Search button nằm bên phải trong khung */}
        <TouchableOpacity
          onPress={applySearch}
          className="absolute right-3 top-1/2 -translate-y-1/2">
          <Text className="text-xl text-gray-500">🔍</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ PAGINATION */}
      {/* ✅ Pagination UI mới gọn đẹp */}
      <View className="my-4 flex-row items-center justify-center">
        {/* Previous */}
        <TouchableOpacity
          disabled={page === 1}
          onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
          className={`mx-2 rounded-full px-4 py-2 ${page === 1 ? 'bg-gray-300' : 'bg-blue-500'}`}>
          <Text className={`${page === 1 ? 'text-gray-600' : 'text-white'}`}>◀ Trước</Text>
        </TouchableOpacity>

        {/* Page number */}
        <Text className="mx-3 text-lg font-semibold text-gray-700">
          Trang <Text className="text-blue-600">{page}</Text>
        </Text>

        {/* Next */}
        <TouchableOpacity
          disabled={!hasMore}
          onPress={() => setPage((prev) => (hasMore ? prev + 1 : prev))}
          className={`mx-2 rounded-full px-4 py-2 ${hasMore ? 'bg-blue-500' : 'bg-gray-300'}`}>
          <Text className={`${hasMore ? 'text-white' : 'text-gray-600'}`}>Sau ▶</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ PO LIST */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0a6ed1" />
        </View>
      ) : (
        <POHeaderList ref={listRef} data={data} />
      )}

      {/* ✅ FILTER MODAL (ẩn trong icon filter) */}
      <Modal visible={filterVisible} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/40">
          <View className="max-h-[85%] rounded-t-3xl bg-white p-5 pb-10 pt-8">
            <View style={{ paddingTop: 20 }} />

            <View className="mb-5 flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-blue-600">Filter Options</Text>

              <TouchableOpacity onPress={() => setFilterVisible(false)} className="p-2">
                <Text className="text-2xl text-gray-500">✕</Text>
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              <TextInput
                className="rounded-xl border border-gray-300 bg-gray-50 p-3"
                placeholder="Company Code"
                value={filters.comp_code}
                onChangeText={(t) => setFilters((prev) => ({ ...prev, comp_code: t }))}
              />

              <TextInput
                className="my-3 rounded-xl border border-gray-300 bg-gray-50 p-3"
                placeholder="Vendor"
                value={filters.vendor}
                onChangeText={(t) => setFilters((prev) => ({ ...prev, vendor: t }))}
              />

              <TextInput
                className="rounded-xl border border-gray-300 bg-gray-50 p-3"
                placeholder="Purchasing Org"
                value={filters.purch_org}
                onChangeText={(t) => setFilters((prev) => ({ ...prev, purch_org: t }))}
              />
            </View>

            <View className="mt-10 flex-row justify-between">
              <TouchableOpacity
                className="rounded-xl bg-gray-200 px-6 py-3"
                onPress={() => {
                  setFilters({
                    comp_code: '',
                    vendor: '',
                    purch_org: '',
                    po_id: '',
                  });
                }}>
                <Text className="font-semibold text-gray-700">Clear</Text>
              </TouchableOpacity>

              {/* Apply button */}
              <TouchableOpacity
                className="rounded-xl bg-blue-600 px-6 py-3"
                onPress={() => {
                  setFilterVisible(false);
                  setPage(1);
                  loadData(1);
                }}>
                <Text className="font-semibold text-white">Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
