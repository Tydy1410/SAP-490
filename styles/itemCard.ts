import { StyleSheet } from 'react-native';

export const itemCardStyles = StyleSheet.create({
    // ITEM CARD CONTAINER
    itemCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    // ITEM HEADER
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    itemHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    itemNumberBadge: {
        backgroundColor: '#dbeafe',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginRight: 10,
    },
    itemNumberText: {
        color: '#1e40af',
        fontSize: 14,
        fontWeight: '700',
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
    },
    materialGroupBadge: {
        backgroundColor: '#f3f4f6',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    materialGroupText: {
        color: '#6b7280',
        fontSize: 12,
        fontWeight: '600',
    },

    // MATERIAL SECTION
    materialSection: {
        marginBottom: 12,
    },
    materialRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    materialInfo: {
        marginLeft: 10,
        flex: 1,
    },
    materialLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 2,
    },
    materialValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1f2937',
    },
    materialDescription: {
        fontSize: 14,
        color: '#4b5563',
        lineHeight: 20,
    },

    // LOCATION ROW
    locationRow: {
        flexDirection: 'row',
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    locationItem: {
        flex: 1,
    },
    locationLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    locationLabel: {
        fontSize: 11,
        color: '#6b7280',
        marginLeft: 6,
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    locationValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginLeft: 18,
    },

    // PRICE ROW
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f0f9ff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    priceLabel: {
        fontSize: 11,
        color: '#6b7280',
        marginBottom: 6,
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1f2937',
        marginLeft: 6,
    },
    priceSection: {
        alignItems: 'flex-end',
    },
    priceValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    priceValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#10b981',
        marginLeft: 6,
    },

    // DELIVERY SECTION
    deliverySection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ecfdf5',
        borderRadius: 6,
        padding: 10,
        borderLeftWidth: 3,
        borderLeftColor: '#10b981',
    },
    deliveryText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#059669',
        marginLeft: 8,
    },
});
