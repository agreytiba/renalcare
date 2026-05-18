import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Droplets, Plus, AlertTriangle, X, Save } from 'lucide-react-native';
import { supabase } from '../api/supabase';
import { useStore } from '../store/useStore';

export default function WaterIntakeScreen() {
  const { t } = useTranslation();
  const { user } = useStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [currentIntake, setCurrentIntake] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [customAmount, setCustomAmount] = useState('');

  const dailyLimit = 1500; // ml

  const fetchTodayIntake = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    try {
      const { data, error: fetchError } = await supabase
        .from('water_intake')
        .select('*')
        .eq('user_id', user.id)
        .gte('intake_time', startOfDay.toISOString())
        .lte('intake_time', endOfDay.toISOString())
        .order('intake_time', { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setLogs(data || []);
      const total = (data || []).reduce((sum, item) => sum + item.amount_ml, 0);
      setCurrentIntake(total);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch water intake logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayIntake();
  }, [user]);

  const handleAddWater = async (amount: number) => {
    if (!user) return;
    if (amount <= 0 || isNaN(amount)) {
      Alert.alert('Validation Error', 'Please enter a valid amount.');
      return;
    }

    setSaving(true);
    try {
      const { error: insertError } = await supabase
        .from('water_intake')
        .insert({
          user_id: user.id,
          amount_ml: amount,
          intake_time: new Date().toISOString(),
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setIsModalVisible(false);
      setCustomAmount('');
      Alert.alert('Success', `Logged ${amount} ml of water.`);
      fetchTodayIntake();
    } catch (err: any) {
      Alert.alert('Error Saving', err.message || 'Failed to log water intake. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const percentage = Math.min((currentIntake / dailyLimit) * 100, 100);
  const isNearLimit = (currentIntake / dailyLimit) >= 0.8;

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-50">
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text className="text-slate-500 mt-2">Loading water intake...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="p-4">
        {error && (
          <View className="bg-rose-50 border border-rose-100 p-4 rounded-2xl mb-4">
            <Text className="text-rose-700 text-sm">{error}</Text>
          </View>
        )}

        {/* Circular Progress & Info */}
        <View className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 items-center mb-6">
          <Text className="text-slate-500 font-bold mb-6 text-lg">Today's Intake</Text>
          
          <View className="w-48 h-48 rounded-full border-[12px] border-slate-100 items-center justify-center relative">
            {/* Native progress bar mock styled with tailwind */}
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

        {/* Quick Add Grid */}
        <Text className="font-bold text-slate-800 text-lg mb-4 ml-2">Quick Add</Text>
        <View className="flex-row justify-between mb-6">
          <TouchableOpacity 
            onPress={() => handleAddWater(100)}
            disabled={saving}
            className="bg-white p-4 rounded-3xl flex-1 mr-2 items-center shadow-sm border border-slate-100 active:bg-slate-50"
          >
            <Text className="font-bold text-sky-500 text-lg mb-1">+100 ml</Text>
            <Text className="text-slate-400 text-xs">Small Cup</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleAddWater(250)}
            disabled={saving}
            className="bg-white p-4 rounded-3xl flex-1 mx-1 items-center shadow-sm border border-slate-100 active:bg-slate-50"
          >
            <Text className="font-bold text-sky-500 text-lg mb-1">+250 ml</Text>
            <Text className="text-slate-400 text-xs">Glass</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleAddWater(500)}
            disabled={saving}
            className="bg-white p-4 rounded-3xl flex-1 ml-2 items-center shadow-sm border border-slate-100 active:bg-slate-50"
          >
            <Text className="font-bold text-sky-500 text-lg mb-1">+500 ml</Text>
            <Text className="text-slate-400 text-xs">Bottle</Text>
          </TouchableOpacity>
        </View>

        {/* Intake logs for today */}
        <View className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-8">
          <Text className="text-lg font-bold text-slate-800 mb-4">Today's Records</Text>
          {logs.length > 0 ? (
            logs.map((log) => (
              <View key={log.id} className="flex-row justify-between items-center py-3 border-b border-slate-50">
                <View className="flex-row items-center">
                  <Droplets color="#38BDF8" size={16} className="mr-2" />
                  <Text className="font-medium text-slate-700">{log.amount_ml} ml</Text>
                </View>
                <Text className="text-xs text-slate-400">{formatTime(log.intake_time)}</Text>
              </View>
            ))
          ) : (
            <View className="py-6 items-center">
              <Text className="text-slate-400">No fluid logs today yet.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Custom Add Float Button */}
      <TouchableOpacity 
        onPress={() => setIsModalVisible(true)}
        className="absolute bottom-6 right-6 bg-sky-500 w-14 h-14 rounded-full items-center justify-center shadow-lg shadow-sky-200 active:opacity-90"
      >
        <Plus color="white" size={28} />
      </TouchableOpacity>

      {/* Custom Intake Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[40px] p-6 max-h-[85%] shadow-2xl">
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row items-center">
                <Droplets color="#38BDF8" size={24} className="mr-2" />
                <Text className="text-xl font-bold text-slate-800 ml-2">Log Water Intake</Text>
              </View>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} className="bg-slate-100 p-2 rounded-full">
                <X color="#64748B" size={20} />
              </TouchableOpacity>
            </View>

            <View className="mb-6">
              <Text className="text-slate-600 font-semibold mb-2">Amount (ml)</Text>
              <TextInput
                value={customAmount}
                onChangeText={setCustomAmount}
                keyboardType="numeric"
                placeholder="e.g. 350"
                className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-base font-bold"
                autoFocus
              />
            </View>

            <TouchableOpacity 
              onPress={() => handleAddWater(parseFloat(customAmount))}
              disabled={saving || !customAmount}
              className="bg-sky-500 rounded-2xl py-4 flex-row justify-center items-center shadow-lg active:opacity-90"
            >
              {saving ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Save color="white" size={20} className="mr-2" />
                  <Text className="text-white font-bold text-lg ml-2">Save Record</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
