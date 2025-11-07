import { StyleSheet } from 'react-native';

export const headerListStyles = StyleSheet.create({
    // PO CARD
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: '#f3f4f6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    // HEADER ROW
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    poBadge: {
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
    },
    poBadgeText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    poId: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e3a8a',
        flex: 1,
    },
    compCodeBadge: {
        backgroundColor: '#e0e7ff',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    compCodeText: {
        color: '#4338ca',
        fontWeight: 'bold',
        fontSize: 14,
    },

    // VENDOR ROW
    vendorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    vendorText: {
        color: '#1f2937',
        fontWeight: '600',
        fontSize: 16,
        marginLeft: 8,
        flex: 1,
    },

    // PURCHASING ORG ROW
    purchOrgRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    purchOrgText: {
        color: '#4b5563',
        fontSize: 14,
        marginLeft: 8,
    },

    // DIVIDER
    divider: {
        height: 1,
        backgroundColor: '#f3f4f6',
        marginVertical: 8,
    },

    // BOTTOM ROW
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    amountLabel: {
        color: '#6b7280',
        fontSize: 12,
        marginBottom: 4,
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    amountValue: {
        color: '#111827',
        fontWeight: 'bold',
        fontSize: 18,
        marginLeft: 4,
    },
    currency: {
        color: '#2563eb',
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 4,
    },

    // DATE SECTION
    dateSection: {
        alignItems: 'flex-end',
    },
    dateLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    dateLabel: {
        color: '#6b7280',
        fontSize: 12,
        marginLeft: 4,
    },
    dateValue: {
        color: '#374151',
        fontWeight: '600',
        fontSize: 14,
    },
    createdByRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    createdBy: {
        color: '#9ca3af',
        fontSize: 12,
        marginLeft: 4,
    },

    // STATUS INDICATOR
    statusIndicator: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    statusDot: {
        width: 8,
        height: 8,
        backgroundColor: '#4ade80',
        borderRadius: 4,
    },
});
