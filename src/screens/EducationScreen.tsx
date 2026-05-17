import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { BookOpen, PlayCircle, Users } from 'lucide-react-native';

export default function EducationScreen() {
  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="p-4">
        
        <Text className="text-xl font-bold text-slate-800 mb-4 ml-1">Daily Health Tips</Text>
        
        <TouchableOpacity className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex-row items-center mb-6">
          <View className="bg-green-100 w-16 h-16 rounded-2xl items-center justify-center mr-4">
            <BookOpen color="#16A34A" size={32} />
          </View>
          <View className="flex-1">
            <Text className="font-bold text-slate-800 text-lg mb-1">Kidney-Safe Cooking</Text>
            <Text className="text-slate-500 text-sm leading-5">Learn how to leach potatoes to reduce potassium content safely.</Text>
          </View>
        </TouchableOpacity>

        <Text className="text-xl font-bold text-slate-800 mb-4 ml-1">Video Resources</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          <TouchableOpacity className="bg-white w-64 rounded-3xl overflow-hidden shadow-sm border border-slate-100 mr-4">
            <View className="h-32 bg-slate-800 items-center justify-center">
              <PlayCircle color="white" size={48} opacity={0.8} />
            </View>
            <View className="p-4">
              <Text className="font-bold text-slate-800 mb-1">Understanding Hemodialysis</Text>
              <Text className="text-xs text-slate-500">Dr. Sarah Johnson • 10 mins</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white w-64 rounded-3xl overflow-hidden shadow-sm border border-slate-100 mr-4">
            <View className="h-32 bg-slate-800 items-center justify-center">
              <PlayCircle color="white" size={48} opacity={0.8} />
            </View>
            <View className="p-4">
              <Text className="font-bold text-slate-800 mb-1">Managing Blood Sugar</Text>
              <Text className="text-xs text-slate-500">Diabetes Educator • 15 mins</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

        <Text className="text-xl font-bold text-slate-800 mb-4 ml-1">Community Support</Text>
        <TouchableOpacity className="bg-blue-600 p-6 rounded-3xl shadow-sm flex-row items-center mb-8">
          <Users color="white" size={32} className="mr-4" />
          <View className="flex-1">
            <Text className="font-bold text-white text-lg mb-1">Join the Forum</Text>
            <Text className="text-blue-100 text-sm">Connect with other patients and share your journey.</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}
