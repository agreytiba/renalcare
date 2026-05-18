import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Droplets, Calendar, Weight, X, Save, Clock, Activity, FileText } from 'lucide-react-native';
import { supabase } from '../api/supabase';
import { useStore } from '../store/useStore';

export default function DialysisScreen() {
  const { t } = useTranslation();
  const { user } = useStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sessionDate, setSessionDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState('240'); // 4 hours in minutes
  const [weightBefore, setWeightBefore] = useState('');
  const [weightAfter, setWeightAfter] = useState('');
  const [bpBefore, setBpBefore] = useState('');
  const [bpAfter, setBpAfter] = useState('');
  const [notes, setNotes] = useState('');

  const fetchSessions = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('dialysis_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('session_date', { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setSessions(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load dialysis sessions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  const handleAddSession = async () => {
    if (!user) return;
    
    // Validations
    if (!sessionDate.trim()) {
      Alert.alert('Validation Error', 'Please enter a session date.');
      return;
    }
    const parsedDuration = parseInt(duration, 10);
    if (isNaN(parsedDuration) || parsedDuration <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid session duration in minutes.');
      return;
    }
    const parsedWeightBefore = weightBefore ? parseFloat(weightBefore) : null;
    const parsedWeightAfter = weightAfter ? parseFloat(weightAfter) : null;

    if (parsedWeightBefore !== null && isNaN(parsedWeightBefore)) {
      Alert.alert('Validation Error', 'Weight before must be a valid number.');
      return;
    }
    if (parsedWeightAfter !== null && isNaN(parsedWeightAfter)) {
      Alert.alert('Validation Error', 'Weight after must be a valid number.');
      return;
    }

    setSaving(true);
    try {
      const { error: insertError } = await supabase
        .from('dialysis_sessions')
        .insert({
          user_id: user.id,
          session_date: sessionDate,
          duration_minutes: parsedDuration,
          weight_before: parsedWeightBefore,
          weight_after: parsedWeightAfter,
          blood_pressure_before: bpBefore.trim() || null,
          blood_pressure_after: bpAfter.trim() || null,
          notes: notes.trim() || null,
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      // Reset fields
      setWeightBefore('');
      setWeightAfter('');
      setBpBefore('');
      setBpAfter('');
      setNotes('');
      setIsModalVisible(false);
      Alert.alert('Success', 'Dialysis session logged.');
      fetchSessions();
    } catch (err: any) {
      Alert.alert('Error Saving', err.message || 'Failed to log dialysis session. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const lastSession = sessions[0];
  const weightRemoved = lastSession && lastSession.weight_before && lastSession.weight_after 
    ? (lastSession.weight_before - lastSession.weight_after).toFixed(1) 
    : null;

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-50">
        <ActivityIndicator size="large" color="#1e3a8a" />
        <Text className="text-slate-500 mt-2">Loading dialysis sessions...</Text>
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

        {/* Dynamic Next Session Greeting */}
        <View className="bg-blue-900 p-6 rounded-3xl shadow-sm mb-6">
          <Text className="text-blue-200 font-medium mb-1">Status Overview</Text>
          <Text className="text-2xl font-bold text-white mb-4">
            {sessions.length > 0 ? 'Dialysis Active & Tracked' : 'Start Tracking Sessions'}
          </Text>
          
          <View className="bg-blue-800 p-4 rounded-xl flex-row items-center">
            <Calendar color="#60A5FA" size={24} className="mr-3" />
            <View className="flex-1">
              <Text className="text-white font-medium">Total Logged Sessions</Text>
              <Text className="text-blue-300 text-sm">{sessions.length} sessions logged so far</Text>
            </View>
          </View>
        </View>

        {/* Last Session Details Card */}
        {lastSession ? (
          <View className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-6">
            <Text className="text-lg font-bold text-slate-800 mb-2">Last Session Details</Text>
            <Text className="text-xs text-slate-400 mb-4">{formatDate(lastSession.session_date)}</Text>
            
            <View className="flex-row justify-between mb-4">
              <View className="flex-1 bg-slate-50 p-4 rounded-2xl mr-2 items-center border border-slate-100">
                <Weight color="#94A3B8" size={24} className="mb-2" />
                <Text className="text-slate-500 text-xs text-center mb-1">Weight Difference</Text>
                <Text className="text-lg font-bold text-slate-700">
                  {weightRemoved ? `${weightRemoved} kg` : '--'}
                </Text>
              </View>
              <View className="flex-1 bg-slate-50 p-4 rounded-2xl ml-2 items-center border border-slate-100">
                <Clock color="#38BDF8" size={24} className="mb-2" />
                <Text className="text-slate-500 text-xs text-center mb-1">Duration</Text>
                <Text className="text-lg font-bold text-slate-700">
                  {Math.round(lastSession.duration_minutes / 60)} hrs
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between mb-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <View className="items-center flex-1 border-r border-slate-200">
                <Text className="text-slate-500 text-xs mb-1">BP Before</Text>
                <Text className="font-bold text-slate-700">{lastSession.blood_pressure_before || '--'}</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-slate-500 text-xs mb-1">BP After</Text>
                <Text className="font-bold text-slate-700">{lastSession.blood_pressure_after || '--'}</Text>
              </View>
            </View>
            
            {lastSession.notes && (
              <View className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <Text className="text-amber-800 font-medium mb-1">Session Notes</Text>
                <Text className="text-amber-700 text-sm">{lastSession.notes}</Text>
              </View>
            )}
          </View>
        ) : (
          <View className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-6 items-center">
            <Droplets color="#94A3B8" size={48} className="mb-3" />
            <Text className="text-slate-600 font-bold text-lg">No Dialysis Sessions Yet</Text>
            <Text className="text-slate-400 text-center mt-1 text-sm leading-5">
              Click the button below to log your weights, blood pressure, and notes after your hemodialysis/peritoneal sessions.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Action Footer */}
      <View className="p-4 bg-white border-t border-slate-100">
        <TouchableOpacity 
          onPress={() => setIsModalVisible(true)}
          className="bg-blue-600 rounded-xl py-4 items-center shadow-md shadow-blue-200 active:opacity-90"
        >
          <Text className="text-white font-bold text-lg">Log New Session</Text>
        </TouchableOpacity>
      </View>

      {/* Log Session Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[40px] p-6 max-h-[90%] shadow-2xl">
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row items-center">
                <Droplets color="#2563eb" size={24} className="mr-2" />
                <Text className="text-xl font-bold text-slate-800 ml-2">Log Dialysis Session</Text>
              </View>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} className="bg-slate-100 p-2 rounded-full">
                <X color="#64748B" size={20} />
              </TouchableOpacity>
            </View>

            <ScrollView className="space-y-4 mb-6" showsVerticalScrollIndicator={false}>
              <View className="mb-4">
                <Text className="text-slate-600 font-semibold mb-2">Session Date (YYYY-MM-DD)</Text>
                <TextInput
                  value={sessionDate}
                  onChangeText={setSessionDate}
                  placeholder="e.g. 2026-05-18"
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-base"
                />
              </View>

              <View className="mb-4">
                <Text className="text-slate-600 font-semibold mb-2">Duration (Minutes)</Text>
                <TextInput
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="numeric"
                  placeholder="e.g. 240 for 4 hours"
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-base"
                />
              </View>

              <View className="flex-row justify-between mb-4">
                <View className="flex-1 mr-2">
                  <Text className="text-slate-600 font-semibold mb-2">Weight Before (kg)</Text>
                  <TextInput
                    value={weightBefore}
                    onChangeText={setWeightBefore}
                    keyboardType="numeric"
                    placeholder="e.g. 72.5"
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-base"
                  />
                </View>
                <View className="flex-1 ml-2">
                  <Text className="text-slate-600 font-semibold mb-2">Weight After (kg)</Text>
                  <TextInput
                    value={weightAfter}
                    onChangeText={setWeightAfter}
                    keyboardType="numeric"
                    placeholder="e.g. 70.0"
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-base"
                  />
                </View>
              </View>

              <View className="flex-row justify-between mb-4">
                <View className="flex-1 mr-2">
                  <Text className="text-slate-600 font-semibold mb-2">BP Before</Text>
                  <TextInput
                    value={bpBefore}
                    onChangeText={setBpBefore}
                    placeholder="e.g. 130/80"
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-base"
                  />
                </View>
                <View className="flex-1 ml-2">
                  <Text className="text-slate-600 font-semibold mb-2">BP After</Text>
                  <TextInput
                    value={bpAfter}
                    onChangeText={setBpAfter}
                    placeholder="e.g. 120/75"
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-base"
                  />
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-slate-600 font-semibold mb-2">Doctor Notes / Remarks</Text>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="e.g. Stable session, standard clearance"
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-base"
                />
              </View>
            </ScrollView>

            <TouchableOpacity 
              onPress={handleAddSession}
              disabled={saving}
              className="bg-blue-600 rounded-2xl py-4 flex-row justify-center items-center shadow-lg active:opacity-90"
            >
              {saving ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Save color="white" size={20} className="mr-2" />
                  <Text className="text-white font-bold text-lg ml-2">Save Session Details</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
