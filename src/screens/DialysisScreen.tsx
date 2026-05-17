import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Droplets, Calendar, Weight } from 'lucide-react-native';

export default function DialysisScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="p-4">
        
        <View className="bg-blue-900 p-6 rounded-3xl shadow-sm mb-6">
          <Text className="text-blue-200 font-medium mb-1">Next Session</Text>
          <Text className="text-3xl font-bold text-white mb-4">Tomorrow, 08:00 AM</Text>
          
          <View className="bg-blue-800 p-4 rounded-xl flex-row items-center">
            <Calendar color="#60A5FA" size={24} className="mr-3" />
            <View>
              <Text className="text-white font-medium">City Hospital</Text>
              <Text className="text-blue-300 text-sm">Dr. Smith • 4 Hours Duration</Text>
            </View>
          </View>
        </View>

        <View className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-6">
          <Text className="text-lg font-bold text-slate-800 mb-4">Last Session Details</Text>
          
          <View className="flex-row justify-between mb-4">
            <View className="flex-1 bg-slate-50 p-4 rounded-2xl mr-2 items-center border border-slate-100">
              <Weight color="#94A3B8" size={24} mb={8} />
              <Text className="text-slate-500 text-xs text-center mb-1">Weight Removed</Text>
              <Text className="text-lg font-bold text-slate-700">2.5 kg</Text>
            </View>
            <View className="flex-1 bg-slate-50 p-4 rounded-2xl ml-2 items-center border border-slate-100">
              <Droplets color="#38BDF8" size={24} mb={8} />
              <Text className="text-slate-500 text-xs text-center mb-1">Fluid Removed</Text>
              <Text className="text-lg font-bold text-slate-700">2500 ml</Text>
            </View>
          </View>
          
          <View className="p-4 bg-amber-50 rounded-xl border border-amber-100">
            <Text className="text-amber-800 font-medium mb-1">Doctor's Note</Text>
            <Text className="text-amber-700 text-sm">Patient was stable. Recommend reducing fluid intake by 200ml per day.</Text>
          </View>
        </View>
        
      </ScrollView>

      <View className="p-4 bg-white border-t border-slate-100">
        <TouchableOpacity className="bg-blue-600 rounded-xl py-4 items-center shadow-md shadow-blue-200">
          <Text className="text-white font-bold text-lg">Log New Session</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
