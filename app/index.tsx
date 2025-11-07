import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
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
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchPOHeaders } from '../services/poService';
import POHeaderList from '../components/POHeaderList';
import LoadingScreen from '../components/LoadingScreen';
import EmptyState from '../components/EmptyState';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterVisible]);

  return (
    <View className="flex-1 bg-gray-100">
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <LinearGradient
            colors={['#1e40af', '#2563eb', '#3b82f6']}
            style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 224 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          <SafeAreaView className="flex-1">
            <LinearGradient
              colors={['#1e40af', '#2563eb', '#3b82f6']}
              style={{ paddingHorizontal: 20, paddingBottom: 36, paddingTop: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <MaterialIcons name="receipt-long" size={28} color="white" />
                  <Text className="ml-2 text-2xl font-bold text-white">Purchase Orders</Text>
                </View>

                <TouchableOpacity
                  onPress={() => setFilterVisible(true)}
                  className="rounded-2xl bg-white/20 p-3">
                  <Ionicons name="options" size={20} color="white" />
                </TouchableOpacity>
              </View>

              <View className="mt-4 w-full flex-row items-center">
                <View className="mr-3 flex-1 flex-row items-center rounded-xl bg-white px-4 py-3 shadow">
                  <Ionicons name="search" size={20} color="#9CA3AF" />
                  <TextInput
                    className="ml-2 flex-1"
                    placeholder="Search PO number..."
                    value={searchPO}
                    onChangeText={setSearchPO}
                  />
                  {searchPO.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setSearchPO('')}
                      className="ml-2 p-1"
                      activeOpacity={0.6}
                    >
                      <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => {
                    setPage(1);
                    loadData(1);
                  }}
                  className="flex-row items-center justify-center rounded-xl bg-white px-5 py-3 shadow">
                  <Ionicons name="arrow-forward" size={18} color="#2563EB" />
                  <Text className="ml-1 font-bold text-blue-600">Go</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <View className="mt-8 flex-row items-center justify-center pb-3">
              <TouchableOpacity
                disabled={page === 1}
                onPress={() => setPage(page - 1)}
                className={`flex-row items-center rounded-2xl border px-4 py-3 ${page === 1 ? 'border-gray-200 bg-gray-100' : 'border-gray-300 bg-white'
                  }`}>
                <Ionicons
                  name="chevron-back"
                  size={18}
                  color={page === 1 ? '#9CA3AF' : '#374151'}
                />
                <Text className={`ml-1 ${page === 1 ? 'text-gray-400' : 'text-gray-700'}`}>Previous</Text>
              </TouchableOpacity>

              <View className="mx-4 flex-row items-center rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
                <MaterialIcons name="description" size={18} color="#1D4ED8" />
                <Text className="ml-2 text-base font-semibold text-blue-700">Page {page}</Text>
              </View>

              <TouchableOpacity
                disabled={!hasMore}
                onPress={() => setPage(page + 1)}
                className={`flex-row items-center rounded-2xl px-4 py-3 ${hasMore ? 'bg-blue-600' : 'bg-gray-200'
                  }`}>
                <Text className={hasMore ? 'mr-1 text-base text-white' : 'text-gray-500'}>Next</Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={hasMore ? 'white' : '#9CA3AF'}
                />
              </TouchableOpacity>
            </View>

            {data.length === 0 ? (
              <EmptyState
                icon="search-off"
                title="No Purchase Orders Found"
                message={searchPO
                  ? `No results found for "${searchPO}". Try adjusting your search or filters.`
                  : "No purchase orders available. Try changing your filters or search criteria."
                }
              />
            ) : (
              <POHeaderList ref={listRef} data={data} />
            )}

            <Modal visible={filterVisible} transparent animationType="none">
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
              >
                <TouchableWithoutFeedback onPress={() => setFilterVisible(false)}>
                  <View className="flex-1 bg-black/40" />
                </TouchableWithoutFeedback>

                <Animated.View
                  style={{
                    transform: [{ translateY: slideAnim }],
                  }}
                  className="w-full rounded-t-3xl bg-white p-6">
                  <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" style={{ maxHeight: 400 }}>
                    <View className="mb-4 flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Ionicons name="filter" size={24} color="#2563EB" />
                        <Text className="ml-2 text-2xl font-bold text-blue-600">Filters</Text>
                      </View>
                      <TouchableOpacity onPress={() => setFilterVisible(false)}>
                        <Ionicons name="close-circle" size={28} color="#9CA3AF" />
                      </TouchableOpacity>
                    </View>

                    <View className="mb-3 flex-row items-center rounded-xl border-2 border-gray-300 bg-white px-4 py-3">
                      <MaterialIcons name="business" size={20} color="#6B7280" />
                      <TextInput
                        className="ml-3 flex-1 text-gray-900"
                        placeholder="Company Code"
                        placeholderTextColor="#9CA3AF"
                        value={filters.comp_code}
                        onChangeText={(t) => setFilters((prev) => ({ ...prev, comp_code: t }))}
                      />
                    </View>

                    <View className="mb-3 flex-row items-center rounded-xl border-2 border-gray-300 bg-white px-4 py-3">
                      <Ionicons name="people" size={20} color="#6B7280" />
                      <TextInput
                        className="ml-3 flex-1 text-gray-900"
                        placeholder="Vendor"
                        placeholderTextColor="#9CA3AF"
                        value={filters.vendor}
                        onChangeText={(t) => setFilters((prev) => ({ ...prev, vendor: t }))}
                      />
                    </View>

                    <View className="mb-5 flex-row items-center rounded-xl border-2 border-gray-300 bg-white px-4 py-3">
                      <MaterialIcons name="storefront" size={20} color="#6B7280" />
                      <TextInput
                        className="ml-3 flex-1 text-gray-900"
                        placeholder="Purchasing Org"
                        placeholderTextColor="#9CA3AF"
                        value={filters.purch_org}
                        onChangeText={(t) => setFilters((prev) => ({ ...prev, purch_org: t }))}
                      />
                    </View>
                    <View className="mt-3 flex-row justify-between">
                      <TouchableOpacity
                        className="flex-row items-center rounded-xl bg-gray-200 px-6 py-3"
                        onPress={() =>
                          setFilters({
                            comp_code: '',
                            vendor: '',
                            purch_org: '',
                            po_id: '',
                          })
                        }>
                        <MaterialIcons name="clear" size={20} color="#374151" />
                        <Text className="ml-2 font-semibold text-gray-700">Clear</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        className="flex-row items-center rounded-xl bg-blue-600 px-6 py-3"
                        onPress={() => {
                          setFilterVisible(false);
                          setPage(1);
                          loadData(1);
                        }}>
                        <Ionicons name="checkmark-circle" size={20} color="white" />
                        <Text className="ml-2 font-semibold text-white">Apply</Text>
                      </TouchableOpacity>
                    </View>

                    <View className="h-8" />
                  </ScrollView>
                </Animated.View>
              </KeyboardAvoidingView>
            </Modal>
          </SafeAreaView>
        </>
      )}
    </View>
  );
}
