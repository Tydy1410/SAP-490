import { StyleSheet } from 'react-native';

export const detailStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },

    errorText: {
        fontSize: 16,
        color: '#ef4444',
        textAlign: 'center',
    },

    // HEADER SECTION
    headerGradient: {
        paddingTop: 12,
        paddingBottom: 8,
        paddingHorizontal: 16,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 12,
    },
    compCodeBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    compCodeText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '700',
    },

    // INFO SECTION (White background)
    infoSection: {
        backgroundColor: 'white',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    infoContent: {
        marginLeft: 10,
        flex: 1,
    },
    infoLabel: {
        fontSize: 11,
        color: '#6b7280',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
    },

    // GRID LAYOUT (2 columns)
    gridRow: {
        flexDirection: 'row',
        marginBottom: 8,
        gap: 8,
    },
    gridItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        padding: 8,
        borderRadius: 6,
    },
    gridContent: {
        marginLeft: 8,
        flex: 1,
    },
    gridLabel: {
        fontSize: 10,
        color: '#6b7280',
        marginBottom: 2,
    },
    gridValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
    },

    // TOTAL SECTION
    totalSection: {
        backgroundColor: '#f0fdf4',
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#86efac',
    },
    totalLabel: {
        fontSize: 11,
        color: '#166534',
        marginBottom: 4,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    totalRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#10b981',
        marginLeft: 6,
    },
    totalCurrency: {
        fontSize: 14,
        color: '#059669',
        marginLeft: 4,
        fontWeight: '600',
    },

    // ITEMS COUNT
    itemsCountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemsCountLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1f2937',
    },
    itemsCountBadge: {
        backgroundColor: '#dbeafe',
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    itemsCountText: {
        color: '#1e40af',
        fontSize: 12,
        fontWeight: '700',
    },

    // LIST
    listContent: {
        padding: 16,
    },
});
