import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Info } from 'lucide-react-native';

export default function FoodTrackingScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-slate-50">
      <View className="p-4 bg-white border-b border-slate-100 flex-row items-center">
        <View className="flex-1 bg-slate-100 rounded-xl flex-row items-center px-3 py-2 mr-3">
          <Search color="#94A3B8" size={20} />
          <Text className="text-slate-400 ml-2">Search food database...</Text>
        </View>
        <TouchableOpacity className="bg-green-500 w-10 h-10 rounded-xl items-center justify-center">
          <Plus color="white" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView className="p-4">
        <View className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-slate-800">Breakfast</Text>
            <TouchableOpacity><Text className="text-blue-500 font-bold">+ Add</Text></TouchableOpacity>
          </View>
          <View className="flex-row justify-between items-center py-2 border-b border-slate-50">
            <View>
              <Text className="text-slate-700 font-medium">Oatmeal (1 cup)</Text>
              <Text className="text-xs text-slate-400">Low potassium, Safe</Text>
            </View>
            <View className="bg-green-100 px-2 py-1 rounded-md">
              <Text className="text-green-700 text-xs font-bold">Good</Text>
            </View>
          </View>
        </View>

        <View className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-4">
          <View className="flex-row items-start">
            <Info color="#F59E0B" size={24} className="mr-3 mt-1" />
            <View className="flex-1">
              <Text className="font-bold text-slate-800 mb-1">Nutrition Tip</Text>
              <Text className="text-slate-600 text-sm leading-5">
                Avoid foods like bananas, avocados, and potatoes as they are very high in potassium, which can be harmful if you are on dialysis.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
