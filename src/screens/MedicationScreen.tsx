import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Pill, Clock, Plus, CheckCircle2, AlertCircle } from 'lucide-react-native';

export default function MedicationScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="p-4">
        
        {/* Morning Medications */}
        <Text className="text-lg font-bold text-slate-800 mb-4 ml-2">Morning (08:00 AM)</Text>
        <View className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-6">
          
          <View className="flex-row items-center justify-between py-3 border-b border-slate-50">
            <View className="flex-row items-center flex-1">
              <View className="bg-blue-100 p-2 rounded-xl mr-3">
                <Pill color="#3B82F6" size={24} />
              </View>
              <View>
                <Text className="font-bold text-slate-800">Amlodipine (Blood Pressure)</Text>
                <Text className="text-sm text-slate-500">1 Pill • 5mg</Text>
              </View>
            </View>
            <TouchableOpacity>
              <CheckCircle2 color="#22C55E" size={28} />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center flex-1">
              <View className="bg-rose-100 p-2 rounded-xl mr-3">
                <Pill color="#F43F5E" size={24} />
              </View>
              <View>
                <Text className="font-bold text-slate-800">Insulin Glargine</Text>
                <Text className="text-sm text-slate-500">10 Units • Injection</Text>
              </View>
            </View>
            <TouchableOpacity>
              <View className="w-7 h-7 rounded-full border-2 border-slate-300" />
            </TouchableOpacity>
          </View>

        </View>

        {/* Missed Dose Alert */}
        <View className="bg-rose-50 p-4 rounded-2xl flex-row items-start border border-rose-100 mb-6">
          <AlertCircle color="#EF4444" size={24} className="mr-3" />
          <View className="flex-1">
            <Text className="text-rose-800 font-bold mb-1">Missed Dose Alert</Text>
            <Text className="text-rose-700 text-sm">
              You missed your evening Sevelamer (Phosphorus Binder) yesterday. Please consult your doctor if this happens often.
            </Text>
          </View>
        </View>

        {/* History / Adherence */}
        <View className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <Text className="font-bold text-slate-800 mb-3">Weekly Adherence</Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-3xl font-black text-green-500">92%</Text>
            <Text className="text-slate-500 text-sm">Great job! Keep it up to ensure optimal recovery.</Text>
          </View>
        </View>
        
      </ScrollView>

      <TouchableOpacity className="absolute bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg shadow-blue-200">
        <Plus color="white" size={28} />
      </TouchableOpacity>
    </View>
  );
}
