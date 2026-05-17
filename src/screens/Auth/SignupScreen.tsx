import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../api/supabase';

export default function SignupScreen({ navigation }: any) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Check your email for the login link!');
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 justify-center items-center p-6 bg-slate-50">
      <Text className="text-3xl font-bold text-blue-900 mb-8">{t('signup')}</Text>
      
      <View className="w-full mb-4">
        <Text className="text-slate-700 mb-2 font-medium">{t('email')}</Text>
        <TextInput
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3"
          placeholder={t('email')}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View className="w-full mb-8">
        <Text className="text-slate-700 mb-2 font-medium">{t('password')}</Text>
        <TextInput
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3"
          placeholder={t('password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity 
        className="w-full bg-blue-800 rounded-xl py-4 flex-row justify-center items-center"
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold text-lg">{t('signup')}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        className="mt-6"
        onPress={() => navigation.navigate('Login')}
      >
        <Text className="text-blue-600 font-medium">Already have an account? {t('login')}</Text>
      </TouchableOpacity>
    </View>
  );
}
