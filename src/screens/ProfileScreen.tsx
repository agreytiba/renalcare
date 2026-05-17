import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { User, Settings, LogOut, Phone, ShieldAlert, Globe, BookOpen } from 'lucide-react-native';
import { supabase } from '../../api/supabase';
import { useStore } from '../../store/useStore';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const { setLanguage, language } = useStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'sw' : 'en';
    i18n.changeLanguage(newLang);
    setLanguage(newLang);
  };

  return (
    <ScrollView className="flex-1 bg-slate-50">
      <View className="bg-blue-900 p-8 pb-12 rounded-b-[40px] items-center shadow-lg">
        <View className="w-24 h-24 bg-white rounded-full items-center justify-center mb-4 shadow-sm">
          <User color="#1E3A8A" size={48} />
        </View>
        <Text className="text-2xl font-bold text-white mb-1">John Doe</Text>
        <Text className="text-blue-200 font-medium">Type 2 Diabetes • Hemodialysis</Text>
      </View>

      <View className="px-4 -mt-6">
        <View className="bg-white rounded-3xl p-2 shadow-sm border border-slate-100 mb-4">
          
          <TouchableOpacity className="flex-row items-center p-4 border-b border-slate-50" onPress={toggleLanguage}>
            <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-4">
              <Globe color="#3B82F6" size={20} />
            </View>
            <View className="flex-1">
              <Text className="text-slate-800 font-bold text-lg">Language</Text>
              <Text className="text-slate-500">{language === 'en' ? 'English' : 'Swahili'}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center p-4 border-b border-slate-50"
            onPress={() => navigation.navigate('Education' as never)}
          >
            <View className="w-10 h-10 bg-green-50 rounded-full items-center justify-center mr-4">
              <BookOpen color="#16A34A" size={20} />
            </View>
            <Text className="flex-1 text-slate-800 font-bold text-lg">Education & Community</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-4 border-b border-slate-50">
            <View className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center mr-4">
              <Settings color="#64748B" size={20} />
            </View>
            <Text className="flex-1 text-slate-800 font-bold text-lg">{t('settings')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center p-4 border-b border-slate-50"
            onPress={() => navigation.navigate('Emergency' as never)}
          >
            <View className="w-10 h-10 bg-red-50 rounded-full items-center justify-center mr-4">
              <ShieldAlert color="#EF4444" size={20} />
            </View>
            <Text className="flex-1 text-slate-800 font-bold text-lg">{t('emergency')}</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-4" onPress={handleLogout}>
            <View className="w-10 h-10 bg-rose-50 rounded-full items-center justify-center mr-4">
              <LogOut color="#F43F5E" size={20} />
            </View>
            <Text className="flex-1 text-rose-500 font-bold text-lg">Log Out</Text>
          </TouchableOpacity>

        </View>
      </View>
    </ScrollView>
  );
}
