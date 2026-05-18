import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LineChart } from 'react-native-gifted-charts';
import { Plus, X, Save, Calendar, Activity } from 'lucide-react-native';
import { supabase } from '../api/supabase';
import { useStore } from '../store/useStore';

export default function BloodSugarScreen() {
  const { t } = useTranslation();
  const { user } = useStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [average, setAverage] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [level, setLevel] = useState('');
  const [notes, setNotes] = useState('');

  const fetchLogs = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('glucose_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('reading_time', { ascending: false })
        .limit(30);

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setLogs(data || []);

      // Compute average
      if (data && data.length > 0) {
        const sum = data.reduce((acc, curr) => acc + curr.level, 0);
        setAverage(Math.round(sum / data.length));
      } else {
        setAverage(0);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [user]);

  const handleAddLog = async () => {
    if (!user) return;
    const parsedLevel = parseFloat(level);
    if (!level || isNaN(parsedLevel) || parsedLevel <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid blood sugar level.');
      return;
    }

    setSaving(true);
    try {
      const { error: insertError } = await supabase
        .from('glucose_logs')
        .insert({
          user_id: user.id,
          level: parsedLevel,
          notes: notes.trim() || null,
          reading_time: new Date().toISOString(),
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setLevel('');
      setNotes('');
      setIsModalVisible(false);
      Alert.alert('Success', 'Blood sugar log saved.');
      fetchLogs();
    } catch (err: any) {
      Alert.alert('Error Saving', err.message || 'Failed to save log. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getReadingStatus = (lvl: number) => {
    if (lvl < 70) return { label: 'Low', color: 'text-amber-700', bg: 'bg-amber-100' };
    if (lvl <= 140) return { label: 'Normal', color: 'text-green-700', bg: 'bg-green-100' };
    return { label: 'High', color: 'text-rose-700', bg: 'bg-rose-100' };
  };

  const formatDateTime = (isoString: string) => {
    const d = new Date(isoString);
    const dateStr = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${dateStr}, ${timeStr}`;
  };

  // Build chart data - we need chronological order (oldest to newest)
  const chartData = [...logs]
    .reverse()
    .slice(-7) // Take last 7 readings
    .map(log => {
      const d = new Date(log.reading_time);
      const label = d.toLocaleDateString([], { weekday: 'short' });
      return {
        value: log.level,
        label: label,
      };
    });

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-50">
        <ActivityIndicator size="large" color="#F43F5E" />
        <Text className="text-slate-500 mt-2">Loading glucose logs...</Text>
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

        {/* Weekly Chart Card */}
        <View className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6 items-center">
          <Text className="text-slate-500 font-medium mb-4">Glucose Average (Recent)</Text>
          <Text className="text-4xl font-black text-rose-500 mb-6">
            {average > 0 ? average : '--'}{' '}
            <Text className="text-lg text-slate-400 font-bold">mg/dL</Text>
          </Text>
          
          {chartData.length > 0 ? (
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
          ) : (
            <View className="h-[180] justify-center items-center">
              <Text className="text-slate-400 font-medium">Add readings to visualize trends</Text>
            </View>
          )}
        </View>

        {/* Recent Readings List */}
        <View className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-8">
          <Text className="text-lg font-bold text-slate-800 mb-4">Recent Readings</Text>
          
          {logs.length > 0 ? (
            logs.map((log) => {
              const status = getReadingStatus(log.level);
              return (
                <View key={log.id} className="flex-row justify-between items-center py-3.5 border-b border-slate-50">
                  <View className="flex-1 mr-4">
                    <Text className="font-bold text-slate-700 text-base">{log.notes || 'Routine Check'}</Text>
                    <Text className="text-xs text-slate-400 mt-0.5">{formatDateTime(log.reading_time)}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="font-bold text-lg text-slate-800 mr-3">{log.level}</Text>
                    <View className={`${status.bg} px-2.5 py-1 rounded-lg`}>
                      <Text className={`${status.color} text-xs font-bold`}>{status.label}</Text>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <View className="py-8 items-center">
              <Text className="text-slate-400">No readings logged yet.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Float Add Button */}
      <TouchableOpacity 
        onPress={() => setIsModalVisible(true)}
        className="absolute bottom-6 right-6 bg-rose-500 w-14 h-14 rounded-full items-center justify-center shadow-lg shadow-rose-200 active:opacity-90"
      >
        <Plus color="white" size={28} />
      </TouchableOpacity>

      {/* Add Log Modal */}
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
                <Activity color="#F43F5E" size={24} className="mr-2" />
                <Text className="text-xl font-bold text-slate-800 ml-2">Log Blood Sugar</Text>
              </View>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} className="bg-slate-100 p-2 rounded-full">
                <X color="#64748B" size={20} />
              </TouchableOpacity>
            </View>

            <View className="space-y-5 mb-6">
              <View>
                <Text className="text-slate-600 font-semibold mb-2">Blood Sugar Level (mg/dL)</Text>
                <TextInput
                  value={level}
                  onChangeText={setLevel}
                  keyboardType="numeric"
                  placeholder="e.g. 110"
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-base font-bold"
                  autoFocus
                />
              </View>

              <View className="mt-4">
                <Text className="text-slate-600 font-semibold mb-2">Notes / Context</Text>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="e.g. Before Breakfast, After Dinner"
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-base"
                />
              </View>
            </View>

            <TouchableOpacity 
              onPress={handleAddLog}
              disabled={saving}
              className="bg-rose-500 rounded-2xl py-4 flex-row justify-center items-center shadow-lg active:opacity-90 mt-4"
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
