import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchPOHeaders } from '../services/poService';
import POHeaderList from '../components/POHeaderList';
import '../global.css';

export default function App() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [searchPO, setSearchPO] = useState('');
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(page);
  }, [page]);

  const slideAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (filterVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 400,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [filterVisible]);

  return (
    <View className="flex-1 bg-gray-100">
      {/* ✅ NỀN XANH TRÀN FULL LÊN NOTCH */}
      <View className="absolute left-0 right-0 top-0 h-56 bg-blue-600" />

      <SafeAreaView className="flex-1">
        {/* ✅ HEADER */}
        <View className=" bg-blue-600 px-5 pb-9 pt-6 shadow-md">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-white">Purchase Orders</Text>

            <TouchableOpacity
              onPress={() => setFilterVisible(true)}
              className="rounded-2xl bg-white/20 p-3">
              <Text className="text-xl text-white">⚙️</Text>
            </TouchableOpacity>
          </View>

          {/* ✅ SEARCH */}
          <View className="mt-4 w-full flex-row">
            <TextInput
              className="mr-3 flex-1 rounded-xl bg-white px-4 py-3 shadow"
              placeholder="Search PO number..."
              value={searchPO}
              onChangeText={setSearchPO}
            />

            <TouchableOpacity
              onPress={() => {
                setPage(1);
                loadData(1);
              }}
              className="justify-center rounded-xl bg-white px-5 shadow">
              <Text className="font-bold text-blue-600">Go</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ✅ PAGINATION */}
        <View className="mt-4 flex-row items-center justify-center space-x-3 pb-3">
          {/* Previous */}
          <TouchableOpacity
            disabled={page === 1}
            onPress={() => setPage(page - 1)}
            className={`flex-row items-center rounded-2xl border px-4 py-3 ${
              page === 1 ? 'border-gray-200 bg-gray-100' : 'border-gray-300 bg-white'
            }`}>
            <Text className={`mr-1 text-base ${page === 1 ? 'text-gray-400' : 'text-gray-600'}`}>
              ←
            </Text>
            <Text className={page === 1 ? 'text-gray-400' : 'text-gray-700'}>Previous</Text>
          </TouchableOpacity>

          {/* Page */}
          <View className="mx-8 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
            <Text className="text-base font-semibold text-blue-700">Page {page}</Text>
          </View>

          {/* Next */}
          <TouchableOpacity
            disabled={!hasMore}
            onPress={() => setPage(page + 1)}
            className={`flex-row items-center rounded-2xl px-4 py-3 ${
              hasMore ? 'bg-blue-600' : 'bg-gray-200'
            }`}>
            <Text className={hasMore ? 'mr-1 text-base text-white' : 'text-gray-500'}>Next</Text>
            <Text className={hasMore ? 'text-white' : 'text-gray-500'}>→</Text>
          </TouchableOpacity>
        </View>

        {/* ✅ LIST */}
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#0a6ed1" />
          </View>
        ) : (
          <POHeaderList ref={listRef} data={data} />
        )}

        {/* ✅ FILTER MODAL */}
        {/* ✅ FILTER MODAL — SLIDE UP */}
        <Modal visible={filterVisible} transparent animationType="none">
          <TouchableWithoutFeedback onPress={() => setFilterVisible(false)}>
            <View className="flex-1 bg-black/40" />
          </TouchableWithoutFeedback>

          {/* ✅ Animated Bottom Sheet */}
          <Animated.View
            style={{
              transform: [{ translateY: slideAnim }],
            }}
            className="absolute bottom-0 w-full rounded-t-3xl bg-white p-6">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <Text className="mb-4 text-2xl font-bold text-blue-600">Filters</Text>

                {/* Company */}
                <TextInput
                  className="mb-3 rounded-xl border bg-gray-50 px-4 py-3"
                  placeholder="Company Code"
                  value={filters.comp_code}
                  onChangeText={(t) => setFilters((prev) => ({ ...prev, comp_code: t }))}
                />

                {/* Vendor */}
                <TextInput
                  className="mb-3 rounded-xl border bg-gray-50 px-4 py-3"
                  placeholder="Vendor"
                  value={filters.vendor}
                  onChangeText={(t) => setFilters((prev) => ({ ...prev, vendor: t }))}
                />

                {/* Purch Org */}
                <TextInput
                  className="mb-5 rounded-xl border bg-gray-50 px-4 py-3"
                  placeholder="Purchasing Org"
                  value={filters.purch_org}
                  onChangeText={(t) => setFilters((prev) => ({ ...prev, purch_org: t }))}
                />

                {/* Buttons */}
                <View className="mt-3 flex-row justify-between">
                  <TouchableOpacity
                    className="rounded-xl bg-gray-200 px-6 py-3"
                    onPress={() =>
                      setFilters({
                        comp_code: '',
                        vendor: '',
                        purch_org: '',
                        po_id: '',
                      })
                    }>
                    <Text className="font-semibold text-gray-700">Clear</Text>
                  </TouchableOpacity>

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

                <View className="h-8" />
              </ScrollView>
            </KeyboardAvoidingView>
          </Animated.View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}
