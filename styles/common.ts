import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
    // LOADING SCREEN - Shared cho cả home và detail
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContent: {
        alignItems: 'center',
    },
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
});

// Gradient colors (dùng chung cho LinearGradient)
export const gradientColors = {
    blue: ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd'] as const,
    header: ['#1e3a8a', '#2563eb', '#3b82f6'] as const,
};
