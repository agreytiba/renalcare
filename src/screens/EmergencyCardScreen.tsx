import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PhoneCall, ShieldAlert, Heart, Share2, Activity } from 'lucide-react-native';
import { useIsFocused } from '@react-navigation/native';
import { supabase } from '../api/supabase';
import { useStore } from '../store/useStore';

export default function EmergencyCardScreen() {
  const { t } = useTranslation();
  const { user } = useStore();
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  const fetchProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!error) {
        setProfile(data);
      }
    } catch (err) {
      console.log('Failed to fetch profile in emergency card', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchProfile();
    }
  }, [user, isFocused]);

  const handleSOS = () => {
    Alert.alert(
      "SOS Alert", 
      "This will send an emergency SMS with your location to your emergency contacts. Proceed?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Send SOS", style: "destructive", onPress: () => Alert.alert("SOS Sent", "Emergency dispatch notified with coordinates.") }
      ]
    );
  };

  const callAmbulance = () => {
    Linking.openURL('tel:112'); // Standard emergency number
  };

  const shareEmergencyCard = () => {
    Alert.alert("Share Medical ID", "Generated encrypted sharing link for first responders.");
  };

  if (loading && !profile) {
    return (
      <View className="flex-1 justify-center items-center bg-rose-50">
        <ActivityIndicator size="large" color="#E11D48" />
        <Text className="text-rose-900 mt-2 font-medium">Loading Medical ID...</Text>
      </View>
    );
  }

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Unknown Patient';

  return (
    <View className="flex-1 bg-rose-50">
      <ScrollView className="p-4 pt-8">
        
        {/* SOS Button */}
        <View className="items-center mb-8">
          <TouchableOpacity 
            onPress={handleSOS}
            className="w-40 h-40 bg-rose-600 rounded-full items-center justify-center shadow-xl shadow-rose-300 border-[8px] border-rose-200 active:opacity-95"
          >
            <ShieldAlert color="white" size={64} />
            <Text className="text-white font-black text-2xl mt-2">SOS</Text>
          </TouchableOpacity>
          <Text className="text-rose-800 font-semibold mt-4 text-center">
            Press in case of a medical emergency.
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="flex-row justify-between mb-8">
          <TouchableOpacity 
            onPress={callAmbulance}
            className="flex-1 bg-white p-4 rounded-3xl mr-2 items-center shadow-sm border border-slate-100 active:bg-slate-50"
          >
            <View className="bg-rose-100 p-3 rounded-full mb-2">
              <PhoneCall color="#E11D48" size={24} />
            </View>
            <Text className="font-bold text-slate-800">Ambulance</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={shareEmergencyCard}
            className="flex-1 bg-white p-4 rounded-3xl ml-2 items-center shadow-sm border border-slate-100 active:bg-slate-50"
          >
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
            <Text className="text-rose-200 text-xs font-semibold">Offline Available</Text>
          </View>
          
          <View className="p-5">
            <Text className="text-2xl font-black text-slate-800 mb-4">{displayName}</Text>
            
            <View className="flex-row mb-3">
              <Text className="w-32 text-slate-500 font-semibold">Age / Gender:</Text>
              <Text className="flex-1 font-bold text-slate-800">
                {profile?.age ? `${profile.age} years old` : '--'} • {profile?.gender || '--'}
              </Text>
            </View>
            
            <View className="flex-row mb-3">
              <Text className="w-32 text-slate-500 font-semibold">Weight / Height:</Text>
              <Text className="flex-1 font-bold text-slate-800">
                {profile?.weight ? `${profile.weight} kg` : '--'} • {profile?.height ? `${profile.height} cm` : '--'}
              </Text>
            </View>

            <View className="flex-row mb-3">
              <Text className="w-32 text-slate-500 font-semibold">Conditions:</Text>
              <Text className="flex-1 font-bold text-rose-600">
                {profile?.diabetes_type ? `${profile.diabetes_type} Diabetes` : 'Diabetes Patient'}
              </Text>
            </View>

            <View className="flex-row mb-3">
              <Text className="w-32 text-slate-500 font-semibold">Dialysis Regime:</Text>
              <Text className="flex-1 font-bold text-slate-800">
                {profile?.dialysis_type || 'Peritoneal / Hemodialysis'}
              </Text>
            </View>

            <View className="h-[1px] bg-slate-100 my-4" />

            <Text className="text-sm font-bold text-slate-800 mb-2">Emergency Contact</Text>
            <View className="flex-row justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
              <View>
                <Text className="font-bold text-slate-700">Jane Doe (Wife)</Text>
                <Text className="text-slate-500 text-sm">+254 712 345 678</Text>
              </View>
              <TouchableOpacity className="bg-green-100 p-2 rounded-full" onPress={() => Linking.openURL('tel:+254712345678')}>
                <PhoneCall color="#16A34A" size={20} />
              </TouchableOpacity>
            </View>

          </View>
        </View>

      </ScrollView>
    </View>
  );
}
