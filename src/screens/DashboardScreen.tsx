import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { LineChart, BarChart } from 'react-native-gifted-charts';
import { Activity, Droplets, Apple, Pill } from 'lucide-react-native';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const sugarData = [{ value: 110 }, { value: 125 }, { value: 105 }, { value: 130 }, { value: 120 }];
  const waterData = [{ value: 0.5 }, { value: 1.2 }, { value: 1.0 }, { value: 0.8 }];

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <View className="mb-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <View className="flex-row items-center mb-4">
          <Activity color="#F43F5E" size={24} />
          <Text className="text-xl font-bold text-slate-800 ml-2">{t('blood_sugar')}</Text>
        </View>
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
        <TouchableOpacity className="mt-4 bg-rose-500 rounded-xl py-3 items-center">
          <Text className="text-white font-bold">{t('add_record')}</Text>
        </TouchableOpacity>
      </View>

      <View className="mb-6 flex-row justify-between">
        <TouchableOpacity 
          className="bg-white flex-1 p-5 rounded-3xl mr-2 shadow-sm border border-slate-100 items-center"
          onPress={() => navigation.navigate('WaterIntake' as never)}
        >
          <Droplets color="#38BDF8" size={32} />
          <Text className="font-bold text-slate-700 mt-2">{t('water_intake')}</Text>
          <Text className="text-2xl font-black text-sky-500 mt-1">1.2 L</Text>
          <Text className="text-xs text-slate-400 mt-1">Limit: 1.5L</Text>
        </TouchableOpacity>
        
        <View className="bg-white flex-1 p-5 rounded-3xl ml-2 shadow-sm border border-slate-100 items-center">
          <Apple color="#22C55E" size={32} />
          <Text className="font-bold text-slate-700 mt-2">{t('safe_food')}</Text>
          <Text className="text-2xl font-black text-green-500 mt-1">Good</Text>
          <Text className="text-xs text-slate-400 mt-1">Potassium OK</Text>
        </View>
      </View>

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
            <Text className="text-slate-500 text-sm">2 pending today</Text>
          </View>
        </View>
        <Text className="text-blue-500 font-bold">View</Text>
      </TouchableOpacity>

      <View className="mb-8 bg-blue-900 p-6 rounded-3xl shadow-md">
        <Text className="text-white font-bold text-lg mb-2">{t('warning')}</Text>
        <Text className="text-blue-100">
          {t('high_potassium')}
        </Text>
      </View>
    </ScrollView>
  );
}
