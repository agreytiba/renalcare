import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Droplets, Plus, AlertTriangle } from 'lucide-react-native';

export default function WaterIntakeScreen() {
  const { t } = useTranslation();

  const dailyLimit = 1500; // ml
  const currentIntake = 1200; // ml
  const percentage = (currentIntake / dailyLimit) * 100;
  
  // Nearing limit logic
  const isNearLimit = percentage >= 80;

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="p-4">
        
        <View className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 items-center mb-6">
          <Text className="text-slate-500 font-bold mb-6 text-lg">Today's Intake</Text>
          
          {/* Custom Circular Progress Mock */}
          <View className="w-48 h-48 rounded-full border-[12px] border-slate-100 items-center justify-center relative">
            <View className={`absolute w-full h-full rounded-full border-[12px] ${isNearLimit ? 'border-amber-400' : 'border-sky-400'} border-t-transparent border-r-transparent transform -rotate-45`} />
            
            <Droplets color={isNearLimit ? '#FBBF24' : '#38BDF8'} size={40} className="mb-2" />
            <Text className="text-3xl font-black text-slate-800">{currentIntake}<Text className="text-lg text-slate-400"> ml</Text></Text>
            <Text className="text-sm text-slate-400 mt-1">out of {dailyLimit} ml</Text>
          </View>

          {isNearLimit && (
            <View className="mt-8 bg-amber-50 px-4 py-3 rounded-2xl flex-row items-center border border-amber-200">
              <AlertTriangle color="#F59E0B" size={20} className="mr-2" />
              <Text className="text-amber-800 font-medium">Warning: Approaching daily fluid limit.</Text>
            </View>
          )}
        </View>

        <Text className="font-bold text-slate-800 text-lg mb-4 ml-2">Quick Add</Text>
        <View className="flex-row justify-between mb-6">
          <TouchableOpacity className="bg-white p-4 rounded-3xl flex-1 mr-2 items-center shadow-sm border border-slate-100">
            <Text className="font-bold text-sky-500 text-lg mb-1">+100 ml</Text>
            <Text className="text-slate-400 text-xs">Small Cup</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-white p-4 rounded-3xl flex-1 mx-1 items-center shadow-sm border border-slate-100">
            <Text className="font-bold text-sky-500 text-lg mb-1">+250 ml</Text>
            <Text className="text-slate-400 text-xs">Glass</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-white p-4 rounded-3xl flex-1 ml-2 items-center shadow-sm border border-slate-100">
            <Text className="font-bold text-sky-500 text-lg mb-1">+500 ml</Text>
            <Text className="text-slate-400 text-xs">Bottle</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <TouchableOpacity className="absolute bottom-6 right-6 bg-sky-500 w-14 h-14 rounded-full items-center justify-center shadow-lg shadow-sky-200">
        <Plus color="white" size={28} />
      </TouchableOpacity>
    </View>
  );
}
