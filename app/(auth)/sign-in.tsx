import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { loginOData } from '../../services/poService';
import { Ionicons } from '@expo/vector-icons';

export default function SignIN() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

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
        setShowWelcome(true);
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
    <SafeAreaView className="flex-1 bg-white">
      {/* Welcome Modal */}
      <Modal
        visible={showWelcome}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowWelcome(false);
          router.replace('/po-list');
        }}>
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="w-full bg-white rounded-3xl p-8 items-center">
            {/* Success Icon */}
            <View className="mb-6 w-20 h-20 bg-green-500 rounded-full items-center justify-center">
              <Ionicons name="checkmark-circle" size={50} color="white" />
            </View>

            {/* Welcome Text */}
            <Text className="text-3xl font-black text-slate-800 mb-2">Welcome back!</Text>
            <Text className="text-xl font-semibold text-blue-600 mb-6">{username.toUpperCase()}</Text>



            {/* OK Button */}
            <TouchableOpacity
              onPress={() => {
                setShowWelcome(false);
                router.replace('/po-list');
              }}
              className="w-full bg-blue-600 rounded-2xl py-4 items-center">
              <Text className="text-white text-lg font-bold">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Background decorative circles */}
      <View className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400 rounded-full opacity-20" />
      <View className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-400 rounded-full opacity-20" />
      <View className="absolute top-1/4 -left-20 w-40 h-40 bg-blue-300 rounded-full opacity-30" />
      <View className="absolute bottom-1/3 -right-20 w-32 h-32 bg-cyan-300 rounded-full opacity-30" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View className="flex-1 justify-center px-6 py-10">

            {/* Logo + Title */}
            <View className="mb-10 items-center">
              <View className="mb-6 w-24 h-24 bg-blue-600 rounded-3xl items-center justify-center">
                <Text className="text-5xl font-black text-white">P</Text>
              </View>
              <Text className="text-5xl font-black text-slate-800 mb-2">PO Manager</Text>
              <View className="flex-row items-center mb-3">
                <View className="h-1 w-20 bg-blue-600 rounded-l-full" />
                <View className="h-1 w-16 bg-blue-500" />
                <View className="h-1 w-12 bg-cyan-500" />
                <View className="h-1 w-16 bg-cyan-400" />
                <View className="h-1 w-20 bg-cyan-600 rounded-r-full" />
              </View>
              <Text className="text-base text-slate-500 font-semibold">Sign in to your account</Text>
            </View>

            {/* Form Card - Enhanced */}
            <View className="rounded-3xl bg-white border-2 border-blue-100 p-8">
              {/* Decorative top bar */}
              <View className="absolute top-0 left-0 right-0 h-2 bg-blue-600 rounded-t-3xl" />

              {/* Username Field with Icon */}
              <View className="mb-6">
                <Text className="mb-3 text-xs font-bold text-slate-600 uppercase">Username</Text>
                <View className="flex-row items-center border-2 border-slate-200 rounded-2xl bg-slate-50 px-4">
                  <Ionicons name="person-outline" size={20} color="#64748b" />
                  <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter your username"
                    placeholderTextColor="#94a3b8"
                    autoCapitalize="none"
                    className="flex-1 ml-3 py-4 text-base text-slate-800 font-medium"
                  />
                  {username.length > 0 && (
                    <TouchableOpacity onPress={() => setUsername('')} className="ml-2">
                      <Ionicons name="close-circle" size={20} color="#94a3b8" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Password Field with Icon */}
              <View className="mb-6">
                <Text className="mb-3 text-xs font-bold text-slate-600 uppercase">Password</Text>
                <View className="flex-row items-center border-2 border-slate-200 rounded-2xl bg-slate-50 px-4">
                  <Ionicons name="lock-closed-outline" size={20} color="#64748b" />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    className="flex-1 ml-3 py-4 text-base text-slate-800 font-medium"
                  />
                  {password.length > 0 && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="ml-2">
                      <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#64748b" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Error Message - Enhanced */}
              {errorMsg ? (
                <View className="mb-5 bg-red-50 border-l-4 border-red-500 rounded-r-2xl p-4">
                  <View className="flex-row items-center">
                    <Ionicons name="alert-circle" size={20} color="#ef4444" />
                    <Text className="ml-2 text-red-600 font-semibold text-sm flex-1">{errorMsg}</Text>
                  </View>
                </View>
              ) : null}

              {/* Login Button - Enhanced */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                className={`mt-2 items-center rounded-2xl py-5 flex-row justify-center ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}>
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <Text className="text-xl font-black text-white mr-2">Sign In</Text>
                    <Ionicons name="arrow-forward" size={20} color="white" />
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View className="mt-8 items-center">
              <Text className="text-slate-300 text-xs font-light">CREATED BY FA25SAP11</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
