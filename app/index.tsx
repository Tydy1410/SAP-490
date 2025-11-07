import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchPOHeaders, fetchPOCount } from '../services/poService';
import POHeaderList from '../components/POHeaderList';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  const [data, setData] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0); // Tổng số PO (all pages)
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
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
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const shimmerValue = useRef(new Animated.Value(0)).current;

  // Animation for loading spinner - XỊN XÒ HƠN
  useEffect(() => {
    if (loading) {
      // Spin animation
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();

      // Pulse animation cho rings
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

      // Shimmer animation cho text
      Animated.loop(
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.setValue(0);
      pulseValue.setValue(1);
      shimmerValue.setValue(0);
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

  const loadData = async (pageNum: number) => {
    setLoading(true);
    try {
      const currentFilters = {
        ...filters,
        po_id: searchPO,
      };

      // Load both data and total count
      const [res, count] = await Promise.all([
        fetchPOHeaders(pageNum, pageSize, currentFilters),
        fetchPOCount(currentFilters),
      ]);

      setData(res);
      setTotalCount(count); // Cập nhật tổng số PO
      setHasMore(res.length === pageSize);
      listRef.current?.scrollToOffset?.({ offset: 0, animated: true });
    } catch (err) {
      console.error('Error loading PO:', err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData(page);
    setRefreshing(false);
  };

  useEffect(() => {
    loadData(page);
  }, [page]);

  const applySearch = () => {
    setPage(1);
    loadData(1);
  };

  const hasActiveFilters = filters.comp_code || filters.vendor || filters.purch_org;

  if (loading && data.length === 0) {
    return (
      <LinearGradient
        colors={['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.loadingContainer}
      >
        <View style={styles.loadingContent}>
          {/* Outer ring với pulse effect */}
          <Animated.View style={[
            styles.loadingRing,
            {
              transform: [
                { rotate: spin },
                { scale: pulseValue }
              ]
            }
          ]}>
            {/* Inner ring quay ngược */}
            <Animated.View style={[
              styles.loadingRingInner,
              {
                transform: [{ rotate: spin }],
                opacity: 0.6
              }
            ]} />
          </Animated.View>

          {/* Text với shimmer effect */}
          <View style={styles.loadingTextContainer}>
            <Animated.Text style={[styles.loadingTitle, { opacity: shimmerOpacity }]}>
              FA25SAP11
            </Animated.Text>

            {/* Animated dots */}
            <View style={styles.loadingDots}>
              <Animated.View style={[styles.loadingDot, { opacity: shimmerOpacity }]} />
              <Animated.View style={[styles.loadingDot, { marginLeft: 8, opacity: shimmerOpacity }]} />
              <Animated.View style={[styles.loadingDot, { marginLeft: 8, opacity: shimmerOpacity }]} />
            </View>
          </View>

          <Animated.Text style={[styles.loadingSubtitle, { opacity: shimmerOpacity }]}>
            Loading Purchase Orders...
          </Animated.Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* TOP BAR */}
      <View style={styles.topBar}>
        <View style={styles.topBarHeader}>
          <View>
            <Text style={styles.title}>Purchase Orders</Text>
            <Text style={styles.subtitle}>
              {totalCount > 0 ? `${totalCount} PO found` : `${data.length} order(s) found`}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setFilterVisible(true)}
            style={styles.filterButton}
          >
            <MaterialCommunityIcons name="filter-variant" size={24} color="white" />
            {hasActiveFilters && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>!</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search PO number..."
            placeholderTextColor="#9ca3af"
            value={searchPO}
            onChangeText={setSearchPO}
            onSubmitEditing={applySearch}
          />
          {searchPO.length > 0 && (
            <TouchableOpacity onPress={() => {
              setSearchPO('');
              setPage(1);
              loadData(1);
            }}>
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={applySearch} style={styles.searchGoButton}>
            <Text style={styles.searchGoText}>Go</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* PAGINATION */}
      <View style={styles.pagination}>
        <TouchableOpacity
          disabled={page === 1}
          onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
          style={[
            styles.paginationButton,
            styles.paginationButtonLeft,
            page === 1 ? styles.paginationButtonDisabled : styles.paginationButtonActive
          ]}
        >
          <Ionicons name="chevron-back" size={18} color={page === 1 ? '#9ca3af' : 'white'} />
          <Text style={page === 1 ? styles.paginationTextDisabled : styles.paginationTextActive}>
            Previous
          </Text>
        </TouchableOpacity>

        <View style={styles.pageIndicator}>
          <Text style={styles.pageText}>
            Page <Text style={styles.pageNumber}>{page}</Text>
          </Text>
        </View>

        <TouchableOpacity
          disabled={!hasMore}
          onPress={() => setPage((prev) => (hasMore ? prev + 1 : prev))}
          style={[
            styles.paginationButton,
            styles.paginationButtonRight,
            hasMore ? styles.paginationButtonActive : styles.paginationButtonDisabled
          ]}
        >
          <Text style={hasMore ? styles.paginationTextActive : styles.paginationTextDisabled}>
            Next
          </Text>
          <Ionicons name="chevron-forward" size={18} color={hasMore ? 'white' : '#9ca3af'} />
        </TouchableOpacity>
      </View>

      {/* PO LIST */}
      <POHeaderList
        ref={listRef}
        data={data}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      {/* FILTER MODAL */}
      <Modal visible={filterVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <View style={styles.modalIconBadge}>
                  <MaterialCommunityIcons name="filter-variant" size={20} color="#0a6ed1" />
                </View>
                <View>
                  <Text style={styles.modalTitle}>Advanced Filters</Text>
                  <Text style={styles.modalSubtitle}>Refine your search</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setFilterVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Company Code</Text>
                <View style={styles.filterInput}>
                  <MaterialCommunityIcons name="office-building" size={20} color="#6b7280" />
                  <TextInput
                    style={styles.filterTextInput}
                    placeholder="e.g., 1000"
                    placeholderTextColor="#9ca3af"
                    value={filters.comp_code}
                    onChangeText={(t) => setFilters((prev) => ({ ...prev, comp_code: t }))}
                  />
                </View>
              </View>

              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Vendor</Text>
                <View style={styles.filterInput}>
                  <FontAwesome5 name="building" size={18} color="#6b7280" />
                  <TextInput
                    style={styles.filterTextInput}
                    placeholder="Vendor code or name"
                    placeholderTextColor="#9ca3af"
                    value={filters.vendor}
                    onChangeText={(t) => setFilters((prev) => ({ ...prev, vendor: t }))}
                  />
                </View>
              </View>

              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Purchasing Org</Text>
                <View style={styles.filterInput}>
                  <MaterialCommunityIcons name="factory" size={20} color="#6b7280" />
                  <TextInput
                    style={styles.filterTextInput}
                    placeholder="e.g., PO01"
                    placeholderTextColor="#9ca3af"
                    value={filters.purch_org}
                    onChangeText={(t) => setFilters((prev) => ({ ...prev, purch_org: t }))}
                  />
                </View>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonClear]}
                onPress={() => {
                  setFilters({ comp_code: '', vendor: '', purch_org: '', po_id: '' });
                }}
              >
                <MaterialCommunityIcons name="refresh" size={20} color="#6b7280" />
                <Text style={styles.modalButtonTextClear}>Clear All</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonApply]}
                onPress={() => {
                  setFilterVisible(false);
                  setPage(1);
                  loadData(1);
                }}
              >
                <Ionicons name="checkmark-circle" size={20} color="white" />
                <Text style={styles.modalButtonTextApply}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },

  // LOADING SCREEN - XỊN XÒ HƠN với pulse + shimmer
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingContent: { alignItems: 'center' },
  loadingRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 10,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderTopColor: 'white',
    borderRightColor: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  loadingRingInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 6,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderBottomColor: 'white',
    borderLeftColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  loadingTextContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  loadingTitle: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  loadingDots: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  loadingSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loadingText: { marginTop: 12, color: '#4b5563' },
  topBar: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  topBarHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  subtitle: { color: '#bfdbfe', fontSize: 14, marginTop: 2 },
  filterButton: { position: 'relative', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 12, padding: 12 },
  filterBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#ef4444', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  filterBadgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  searchBar: { backgroundColor: 'white', borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: '#111827' },
  searchGoButton: { marginLeft: 8, backgroundColor: '#3b82f6', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  searchGoText: { color: 'white', fontWeight: '600' },
  pagination: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  paginationButton: { flex: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  paginationButtonLeft: { marginRight: 8 },
  paginationButtonRight: { marginLeft: 8 },
  paginationButtonActive: { backgroundColor: '#3b82f6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  paginationButtonDisabled: { backgroundColor: '#f3f4f6' },
  paginationTextActive: { marginLeft: 4, fontWeight: '600', color: 'white' },
  paginationTextDisabled: { marginLeft: 4, fontWeight: '600', color: '#9ca3af' },
  pageIndicator: { marginHorizontal: 8, backgroundColor: '#eff6ff', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12, borderWidth: 2, borderColor: '#bfdbfe' },
  pageText: { textAlign: 'center', fontWeight: 'bold', color: '#374151' },
  pageNumber: { color: '#2563eb' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  modalHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  modalIconBadge: { backgroundColor: '#dbeafe', borderRadius: 20, padding: 8, marginRight: 12 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  modalSubtitle: { fontSize: 14, color: '#6b7280' },
  modalCloseButton: { backgroundColor: '#f3f4f6', borderRadius: 20, padding: 8 },
  modalBody: { paddingHorizontal: 20, paddingVertical: 24 },
  filterGroup: { marginBottom: 16 },
  filterLabel: { color: '#374151', fontWeight: '600', marginBottom: 8, marginLeft: 4 },
  filterInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 2, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12 },
  filterTextInput: { flex: 1, marginLeft: 8, fontSize: 16 },
  modalFooter: { paddingHorizontal: 20, paddingBottom: 24, paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  modalButton: { flex: 1, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  modalButtonClear: { marginRight: 8, backgroundColor: '#f3f4f6' },
  modalButtonApply: { marginLeft: 8, backgroundColor: '#2563eb', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4 },
  modalButtonTextClear: { marginLeft: 8, fontWeight: 'bold', color: '#374151' },
  modalButtonTextApply: { marginLeft: 8, fontWeight: 'bold', color: 'white' },
});
