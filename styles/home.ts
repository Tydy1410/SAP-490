import { StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },

    // TOP BAR
    topBar: {
        paddingTop: 16,
        paddingBottom: 16,
        paddingHorizontal: 16,
        backgroundColor: '#1e3a8a',
    },
    topBarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    filterButton: {
        padding: 8,
        position: 'relative',
    },
    filterBadge: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: '#ef4444',
        borderRadius: 8,
        width: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },

    // SEARCH BAR
    searchBar: {
        backgroundColor: 'white',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 15,
        color: '#1f2937',
    },
    searchGoButton: {
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginLeft: 8,
    },
    searchGoText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },

    // PAGINATION
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    paginationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    paginationButtonLeft: {
        marginRight: 'auto',
    },
    paginationButtonRight: {
        marginLeft: 'auto',
    },
    paginationButtonActive: {
        backgroundColor: '#3b82f6',
    },
    paginationButtonDisabled: {
        backgroundColor: '#f3f4f6',
    },
    paginationTextActive: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
        marginLeft: 6,
    },
    paginationTextDisabled: {
        color: '#9ca3af',
        fontWeight: '600',
        fontSize: 14,
        marginLeft: 6,
    },
    pageInfo: {
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '600',
    },

    // FILTER MODAL
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    modalHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    modalIconBadge: {
        backgroundColor: '#dbeafe',
        borderRadius: 12,
        padding: 12,
        marginRight: 12,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    modalSubtitle: {
        fontSize: 13,
        color: '#6b7280',
    },
    modalCloseButton: {
        padding: 8,
    },
    modalBody: {
        padding: 20,
    },
    filterGroup: {
        marginBottom: 20,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    filterInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    filterTextInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: '#1f2937',
    },
    modalFooter: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 10,
        gap: 8,
    },
    modalButtonReset: {
        backgroundColor: '#f3f4f6',
    },
    modalButtonApply: {
        backgroundColor: '#3b82f6',
    },
    modalButtonTextReset: {
        color: '#374151',
        fontWeight: '600',
        fontSize: 15,
    },
    modalButtonTextApply: {
        color: 'white',
        fontWeight: '600',
        fontSize: 15,
    },
});
