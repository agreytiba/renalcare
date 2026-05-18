import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { LineChart } from 'react-native-gifted-charts';
import { Activity, Droplets, Apple, Pill } from 'lucide-react-native';
import { supabase } from '../api/supabase';
import { useStore } from '../store/useStore';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { t } = useTranslation();
  const { user } = useStore();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [sugarData, setSugarData] = useState<any[]>([]);
  const [waterTotal, setWaterTotal] = useState(0);
  const [medCount, setMedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    if (!user) return;
    setError(null);
    try {
      // 1. Fetch profile name
      const { data: profileData } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', user.id)
        .single();
      
      setProfile(profileData || null);

      // 2. Fetch blood sugar readings (last 5)
      const { data: sugarLogs } = await supabase
        .from('glucose_logs')
        .select('level')
        .eq('user_id', user.id)
        .order('reading_time', { ascending: false })
        .limit(5);

      if (sugarLogs && sugarLogs.length > 0) {
        // Reverse so it reads chronologically left-to-right
        const formattedSugar = [...sugarLogs].reverse().map(log => ({ value: log.level }));
        setSugarData(formattedSugar);
      } else {
        setSugarData([]);
      }

      // 3. Fetch today's water intake
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const { data: waterLogs } = await supabase
        .from('water_intake')
        .select('amount_ml')
        .eq('user_id', user.id)
        .gte('intake_time', startOfDay.toISOString())
        .lte('intake_time', endOfDay.toISOString());

      const waterSum = (waterLogs || []).reduce((sum, log) => sum + log.amount_ml, 0);
      setWaterTotal(waterSum);

      // 4. Fetch medications count
      const { count: medTotal } = await supabase
        .from('medications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      setMedCount(medTotal || 0);
    } catch (err: any) {
      console.log('Dashboard fetch error', err);
      setError('Some stats failed to refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchDashboardData();
    }
  }, [user, isFocused]);

  if (loading && !profile && sugarData.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-50">
        <ActivityIndicator size="large" color="#1e3a8a" />
        <Text className="text-slate-500 mt-2">Refreshing dashboard...</Text>
      </View>
    );
  }

  const welcomeName = profile?.full_name || user?.email?.split('@')[0] || 'Health Warrior';

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      {/* Welcome Banner */}
      <View className="mb-6 mt-2">
        <Text className="text-slate-500 font-semibold text-base">Hello,</Text>
        <Text className="text-3xl font-black text-slate-800 tracking-tight">{welcomeName}</Text>
      </View>

      {error && (
        <View className="bg-amber-50 border border-amber-100 p-3 rounded-2xl mb-4">
          <Text className="text-amber-800 text-xs">{error}</Text>
        </View>
      )}

      {/* Blood Sugar Summary */}
      <View className="mb-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Activity color="#F43F5E" size={24} />
            <Text className="text-xl font-bold text-slate-800 ml-2">{t('blood_sugar')}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('BloodSugar' as never)}>
            <Text className="text-rose-500 font-bold text-sm">View More</Text>
          </TouchableOpacity>
        </View>
        
        {sugarData.length > 0 ? (
          <LineChart 
            data={sugarData}
            width={280}
            height={150}
            color="#F43F5E"
            thickness={3}
            dataPointsColor="#F43F5E"
            hideRules
            yAxisColor="#E2E8F0"
            xAxisColor="#E2E8F0"
          />
        ) : (
          <View className="h-[150] justify-center items-center bg-slate-50 rounded-2xl">
            <Text className="text-slate-400 font-medium">No blood sugar readings logged yet</Text>
          </View>
        )}
        
        <TouchableOpacity 
          onPress={() => navigation.navigate('BloodSugar' as never)}
          className="mt-4 bg-rose-500 rounded-2xl py-4 items-center shadow-md shadow-rose-200"
        >
          <Text className="text-white font-bold text-base">{t('add_record')}</Text>
        </TouchableOpacity>
      </View>

      {/* Cards Row */}
      <View className="mb-6 flex-row justify-between">
        <TouchableOpacity 
          className="bg-white flex-1 p-5 rounded-3xl mr-2 shadow-sm border border-slate-100 items-center"
          onPress={() => navigation.navigate('WaterIntake' as never)}
        >
          <Droplets color="#38BDF8" size={32} />
          <Text className="font-bold text-slate-700 mt-2">{t('water_intake')}</Text>
          <Text className="text-2xl font-black text-sky-500 mt-1">{(waterTotal / 1000).toFixed(2)} L</Text>
          <Text className="text-xs text-slate-400 mt-1">Limit: 1.5L</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-white flex-1 p-5 rounded-3xl ml-2 shadow-sm border border-slate-100 items-center"
          onPress={() => navigation.navigate('Food' as never)}
        >
          <Apple color="#22C55E" size={32} />
          <Text className="font-bold text-slate-700 mt-2">Food Safety</Text>
          <Text className="text-2xl font-black text-green-500 mt-1">Safe</Text>
          <Text className="text-xs text-slate-400 mt-1">Potassium OK</Text>
        </TouchableOpacity>
      </View>

      {/* Medications card */}
      <TouchableOpacity 
        className="mb-6 bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex-row items-center justify-between"
        onPress={() => navigation.navigate('Medication' as never)}
      >
        <View className="flex-row items-center">
          <View className="bg-blue-100 p-3 rounded-xl mr-4">
            <Pill color="#3B82F6" size={24} />
          </View>
          <View>
            <Text className="font-bold text-slate-800 text-lg">Medications</Text>
            <Text className="text-slate-500 text-sm">{medCount} active medication{medCount !== 1 ? 's' : ''}</Text>
          </View>
        </View>
        <Text className="text-blue-500 font-bold">View</Text>
      </TouchableOpacity>

      {/* Warnings & Tips Banner */}
      <View className="mb-8 bg-blue-900 p-6 rounded-3xl shadow-md">
        <Text className="text-white font-bold text-lg mb-2">{t('warning')}</Text>
        <Text className="text-blue-100 leading-5">
          {t('high_potassium')} Avoid high sodium foods as well to prevent liquid retention.
        </Text>
      </View>
    </ScrollView>
  );
}
