import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface EmptyStateProps {
    icon?: keyof typeof MaterialIcons.glyphMap;
    title: string;
    message: string;
}

export default function EmptyState({
    icon = 'inbox',
    title,
    message
}: EmptyStateProps) {
    return (
        <View className="flex-1 items-center justify-center px-8 py-12">
            <View className="items-center">
                {/* Icon */}
                <View className="mb-6 rounded-full bg-gray-100 p-8">
                    <MaterialIcons name={icon} size={80} color="#9CA3AF" />
                </View>

                {/* Title */}
                <Text className="mb-3 text-center text-xl font-bold text-gray-800">
                    {title}
                </Text>

                {/* Message */}
                <Text className="text-center text-base leading-6 text-gray-500">
                    {message}
                </Text>
            </View>
        </View>
    );
}