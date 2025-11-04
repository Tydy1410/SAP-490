import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  ScrollView, 
} from 'react-native';
import { fetchPOHeaders } from '../services/poService';
import POHeaderList from '../components/POHeaderList'; 
import '../global.css';

export default function App() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    comp_code: '',
    vendor: '',
    purch_org: '',
    po_id: '',
  });

  const pageSize = 40;

  // 🔹 ref để điều khiển FlatList trong POHeaderList
  const listRef = useRef<any>(null);

  const loadData = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await fetchPOHeaders(pageNum, pageSize, filters);
      setData(res);
      setHasMore(res.length === pageSize);

      // 🆙 Kéo lên đầu sau khi load trang mới
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

  const handleFilter = () => {
    setPage(1);
    loadData(1);
  };

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-4">
      {/* ===== Filter Section (ngang) ===== */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
        <View className="flex-row items-center space-x-2">
          <TextInput
            className="w-36 rounded-lg border border-gray-300 bg-white px-3 py-2"
            placeholder="Company Code"
            value={filters.comp_code}
            onChangeText={(text) => setFilters((prev) => ({ ...prev, comp_code: text }))}
          />
          <TextInput
            className="w-36 rounded-lg border border-gray-300 bg-white px-3 py-2"
            placeholder="Vendor"
            value={filters.vendor}
            onChangeText={(text) => setFilters((prev) => ({ ...prev, vendor: text }))}
          />
          <TextInput
            className="w-36 rounded-lg border border-gray-300 bg-white px-3 py-2"
            placeholder="Purch. Org"
            value={filters.purch_org}
            onChangeText={(text) => setFilters((prev) => ({ ...prev, purch_org: text }))}
          />
          <TextInput
            className="w-40 rounded-lg border border-gray-300 bg-white px-3 py-2"
            placeholder="PO ID"
            value={filters.po_id}
            onChangeText={(text) => setFilters((prev) => ({ ...prev, po_id: text }))}
          />
          <TouchableOpacity onPress={handleFilter} className="rounded-lg bg-blue-600 px-4 py-2">
            <Text className="font-semibold text-white">Lọc</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ===== Pagination ===== */}
      <View className="mb-4 mt-2 flex-row items-center justify-center space-x-4">
        <TouchableOpacity
          disabled={page === 1}
          onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
          className={`rounded-xl px-4 py-2 ${page === 1 ? 'bg-gray-300' : 'bg-blue-500'}`}>
          <Text className={`font-semibold ${page === 1 ? 'text-gray-600' : 'text-white'}`}>
            ⬅ Trang trước
          </Text>
        </TouchableOpacity>

        <View className="mx-3 rounded-lg border border-gray-300 bg-white px-4 py-2">
          <Text className="font-semibold text-gray-700">
            Trang <Text className="text-blue-600">{page}</Text>
          </Text>
        </View>

        <TouchableOpacity
          disabled={!hasMore}
          onPress={() => setPage((prev) => (hasMore ? prev + 1 : prev))}
          className={`rounded-xl px-4 py-2 ${hasMore ? 'bg-blue-500' : 'bg-gray-300'}`}>
          <Text className={`font-semibold ${hasMore ? 'text-white' : 'text-gray-600'}`}>
            Trang sau ➡
          </Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View className="mb-2 mt-2 items-center">
          <ActivityIndicator size="small" color="#007AFF" />
          <Text className="mt-1 text-sm text-gray-500">Đang tải trang {page}...</Text>
        </View>
      )}

      {/* ===== Danh sách PO (FlatList bên trong) ===== */}
      <POHeaderList ref={listRef} data={data} />
    </View>
  );
}
