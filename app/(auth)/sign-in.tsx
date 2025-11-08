import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { loginOData } from '../../services/poService';

export default function SignIN() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErrorMsg('');

    // 🧩 Kiểm tra nhập liệu
    if (!username || !password) {
      setErrorMsg('⚠️ Vui lòng nhập đầy đủ Username và Password!');
      return;
    }

    setLoading(true);

    try {
      console.log('🚀 Gọi loginOData...');
      const result = await loginOData(username.trim(), password);

      console.log('🔍 Kết quả login:', result);

      // ✅ Nếu login thành công
      if (result?.success) {
        console.log('✅ Login thành công — chuyển sang PO List');
        Alert.alert('Đăng nhập thành công', `Chào ${username}!`, [
          { text: 'OK', onPress: () => router.replace('/po-list') },
        ]);
      } else {
        console.log('❌ Sai thông tin đăng nhập hoặc không có quyền.');
        setErrorMsg('Sai thông tin đăng nhập hoặc không có quyền truy cập.');
      }
    } catch (e: any) {
      console.error('🔥 Lỗi khi gọi loginOData:', e.message);
      setErrorMsg('Không thể kết nối đến SAP hoặc mạng bị lỗi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-blue-600">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1 justify-center px-8">

          {/* ✅ Logo + Title */}
          <View className="mb-12 items-center">
            <Text className="text-4xl font-extrabold text-white">PO Manager</Text>
            <Text className="mt-2 text-base text-white/70">Đăng nhập để tiếp tục</Text>
          </View>

          {/* ✅ Form */}
          <View className="rounded-3xl bg-white p-6 shadow-xl">
            <Text className="mb-1 text-sm font-semibold text-gray-700">Username</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Nhập username..."
              autoCapitalize="none"
              className="mb-4 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
            />

            <Text className="mb-1 text-sm font-semibold text-gray-700">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Nhập password..."
              secureTextEntry
              autoCapitalize="none"
              className="mb-4 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
            />

            {/* ❗ Thông báo lỗi */}
            {errorMsg ? (
              <Text className="text-red-500 mb-2 text-center">{errorMsg}</Text>
            ) : null}

            {/* ✅ Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className="mt-2 items-center rounded-xl bg-blue-600 py-4">
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-lg font-bold text-white">Sign In</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
