import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PhoneCall, ShieldAlert, Heart, FileText, Share2 } from 'lucide-react-native';

export default function EmergencyCardScreen() {
  const { t } = useTranslation();

  const handleSOS = () => {
    Alert.alert(
      "SOS Alert", 
      "This will send an emergency SMS with your location to your emergency contacts. Proceed?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Send SOS", style: "destructive", onPress: () => console.log('SOS Sent') }
      ]
    );
  };

  const callAmbulance = () => {
    Linking.openURL('tel:112'); // Standard emergency number, adjust per region
  };

  return (
    <View className="flex-1 bg-rose-50">
      <ScrollView className="p-4 pt-8">
        
        {/* SOS Button */}
        <View className="items-center mb-8">
          <TouchableOpacity 
            onPress={handleSOS}
            className="w-40 h-40 bg-rose-600 rounded-full items-center justify-center shadow-xl shadow-rose-300 border-[8px] border-rose-200"
          >
            <ShieldAlert color="white" size={64} />
            <Text className="text-white font-black text-2xl mt-2">SOS</Text>
          </TouchableOpacity>
          <Text className="text-rose-800 font-medium mt-4 text-center">
            Press in case of a medical emergency.
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="flex-row justify-between mb-8">
          <TouchableOpacity 
            onPress={callAmbulance}
            className="flex-1 bg-white p-4 rounded-3xl mr-2 items-center shadow-sm border border-slate-100"
          >
            <View className="bg-rose-100 p-3 rounded-full mb-2">
              <PhoneCall color="#E11D48" size={24} />
            </View>
            <Text className="font-bold text-slate-800">Ambulance</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1 bg-white p-4 rounded-3xl ml-2 items-center shadow-sm border border-slate-100">
            <View className="bg-blue-100 p-3 rounded-full mb-2">
              <Share2 color="#2563EB" size={24} />
            </View>
            <Text className="font-bold text-slate-800">Share Info</Text>
          </TouchableOpacity>
        </View>

        {/* Medical ID Card (Offline) */}
        <View className="bg-white rounded-3xl overflow-hidden shadow-md border border-slate-200 mb-8">
          <View className="bg-rose-600 p-4 flex-row items-center">
            <Heart color="white" size={24} className="mr-2" />
            <Text className="text-white font-bold text-lg flex-1">Medical ID Card</Text>
            <Text className="text-rose-200 text-xs">Offline Available</Text>
          </View>
          
          <View className="p-5">
            <Text className="text-2xl font-bold text-slate-800 mb-4">John Doe</Text>
            
            <View className="flex-row mb-3">
              <Text className="w-32 text-slate-500 font-medium">Blood Type:</Text>
              <Text className="flex-1 font-bold text-slate-800">O Positive</Text>
            </View>
            
            <View className="flex-row mb-3">
              <Text className="w-32 text-slate-500 font-medium">Conditions:</Text>
              <Text className="flex-1 font-bold text-slate-800">Type 2 Diabetes, Stage 4 CKD</Text>
            </View>

            <View className="flex-row mb-3">
              <Text className="w-32 text-slate-500 font-medium">Allergies:</Text>
              <Text className="flex-1 font-bold text-rose-600">Penicillin, Peanuts</Text>
            </View>

            <View className="flex-row mb-3">
              <Text className="w-32 text-slate-500 font-medium">Dialysis:</Text>
              <Text className="flex-1 font-bold text-slate-800">Hemodialysis (Mon/Wed/Fri)</Text>
            </View>

            <View className="h-[1px] bg-slate-100 my-4" />

            <Text className="text-sm font-bold text-slate-800 mb-2">Emergency Contact</Text>
            <View className="flex-row justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
              <View>
                <Text className="font-bold text-slate-700">Jane Doe (Wife)</Text>
                <Text className="text-slate-500 text-sm">+254 712 345 678</Text>
              </View>
              <TouchableOpacity className="bg-green-100 p-2 rounded-full">
                <PhoneCall color="#16A34A" size={20} />
              </TouchableOpacity>
            </View>

          </View>
        </View>

      </ScrollView>
    </View>
  );
}
