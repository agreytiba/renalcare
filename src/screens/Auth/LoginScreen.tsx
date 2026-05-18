import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Eye, EyeOff, LogIn, Activity } from 'lucide-react-native';
import { supabase } from '../../api/supabase';

export default function LoginScreen({ navigation }: any) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Validation / Error States
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const validate = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    setGeneralError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      });
      
      if (error) {
        setGeneralError(error.message);
      }
    } catch (err: any) {
      setGeneralError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-50"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-center px-6 py-12">
          
          {/* Header/Logo Section */}
          <View className="items-center mb-10">
            <View className="w-20 h-20 bg-blue-900 rounded-3xl justify-center items-center mb-4 shadow-xl shadow-blue-900/30">
              <Activity color="#FFFFFF" size={40} />
            </View>
            <Text className="text-3xl font-extrabold text-blue-950 tracking-tight">RenalCare</Text>
            <Text className="text-slate-500 mt-2 text-center text-base px-6">
              Empowering dialysis & diabetes patient care
            </Text>
          </View>

          {/* Form Card */}
          <View className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/80">
            <Text className="text-2xl font-bold text-slate-800 mb-6">{t('welcome')}</Text>

            {/* General Error Message */}
            {generalError ? (
              <View className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5">
                <Text className="text-red-700 font-medium text-sm">{generalError}</Text>
              </View>
            ) : null}

            {/* Email Field */}
            <View className="mb-5">
              <Text className="text-slate-700 mb-2 font-semibold text-sm">Email Address</Text>
              <View className={`flex-row items-center bg-slate-50 border ${emailError ? 'border-red-400' : 'border-slate-200'} rounded-2xl px-4 py-3.5`}>
                <Mail color="#64748B" size={20} className="mr-3" />
                <TextInput
                  className="flex-1 text-slate-800 text-base ml-2"
                  placeholder="Enter your email"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError('');
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />
              </View>
              {emailError ? (
                <Text className="text-red-500 text-xs mt-1.5 ml-2 font-medium">{emailError}</Text>
              ) : null}
            </View>

            {/* Password Field */}
            <View className="mb-6">
              <Text className="text-slate-700 mb-2 font-semibold text-sm">{t('password')}</Text>
              <View className={`flex-row items-center bg-slate-50 border ${passwordError ? 'border-red-400' : 'border-slate-200'} rounded-2xl px-4 py-3.5`}>
                <Lock color="#64748B" size={20} className="mr-3" />
                <TextInput
                  className="flex-1 text-slate-800 text-base ml-2"
                  placeholder="Enter your password"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError('');
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-1">
                  {showPassword ? (
                    <EyeOff color="#64748B" size={20} />
                  ) : (
                    <Eye color="#64748B" size={20} />
                  )}
                </TouchableOpacity>
              </View>
              {passwordError ? (
                <Text className="text-red-500 text-xs mt-1.5 ml-2 font-medium">{passwordError}</Text>
              ) : null}
            </View>

            {/* Login Button */}
            <TouchableOpacity 
              className="w-full bg-blue-900 rounded-2xl py-4 flex-row justify-center items-center shadow-lg shadow-blue-900/20 active:opacity-90"
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <LogIn color="white" size={20} className="mr-2" />
                  <Text className="text-white font-bold text-lg ml-2">{t('login')}</Text>
                </>
              )}
            </TouchableOpacity>

          </View>

          {/* Navigation to Signup */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-slate-500 text-base">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text className="text-blue-900 font-bold text-base">{t('signup')}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
