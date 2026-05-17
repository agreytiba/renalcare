import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LineChart } from 'react-native-gifted-charts';
import { Plus } from 'lucide-react-native';

export default function BloodSugarScreen() {
  const { t } = useTranslation();

  const chartData = [
    { value: 110, label: 'Mon' },
    { value: 125, label: 'Tue' },
    { value: 105, label: 'Wed' },
    { value: 130, label: 'Thu' },
    { value: 115, label: 'Fri' },
    { value: 120, label: 'Sat' },
    { value: 110, label: 'Sun' }
  ];

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="p-4">
        <View className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6 items-center">
          <Text className="text-slate-500 font-medium mb-4">Weekly Average</Text>
          <Text className="text-4xl font-black text-rose-500 mb-6">116 <Text className="text-lg text-slate-400">mg/dL</Text></Text>
          
          <LineChart
            data={chartData}
            width={280}
            height={180}
            color="#F43F5E"
            thickness={3}
            dataPointsColor="#F43F5E"
            hideRules
            yAxisColor="#E2E8F0"
            xAxisColor="#E2E8F0"
            yAxisTextStyle={{color: '#94A3B8'}}
            xAxisLabelTextStyle={{color: '#94A3B8'}}
            curved
          />
        </View>

        <View className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <Text className="text-lg font-bold text-slate-800 mb-4">Recent Readings</Text>
          
          <View className="flex-row justify-between items-center py-3 border-b border-slate-50">
            <View>
              <Text className="font-bold text-slate-700">Before Breakfast</Text>
              <Text className="text-xs text-slate-400">Today, 07:30 AM</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="font-bold text-lg text-slate-800 mr-2">105</Text>
              <View className="bg-green-100 px-2 py-1 rounded-md">
                <Text className="text-green-700 text-xs font-bold">Normal</Text>
              </View>
            </View>
          </View>
          
        </View>
      </ScrollView>

      <TouchableOpacity className="absolute bottom-6 right-6 bg-rose-500 w-14 h-14 rounded-full items-center justify-center shadow-lg shadow-rose-200">
        <Plus color="white" size={28} />
      </TouchableOpacity>
    </View>
  );
}
