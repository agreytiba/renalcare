import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Pill, Clock, Plus, Trash2, X, Save, Check } from 'lucide-react-native';
import { supabase } from '../api/supabase';
import { useStore } from '../store/useStore';

export default function MedicationScreen() {
  const { t } = useTranslation();
  const { user } = useStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [meds, setMeds] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('Morning');
  const [notes, setNotes] = useState('');

  const fetchMedications = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setMeds(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch medications list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, [user]);

  const handleAddMedication = async () => {
    if (!user) return;
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter a medication name.');
      return;
    }
    if (!dosage.trim()) {
      Alert.alert('Validation Error', 'Please enter dosage (e.g. 5mg, 1 Pill).');
      return;
    }

    setSaving(true);
    try {
      const { error: insertError } = await supabase
        .from('medications')
        .insert({
          user_id: user.id,
          name: name.trim(),
          dosage: dosage.trim(),
          frequency: frequency.trim() || 'Once daily',
          time_of_day: timeOfDay,
          notes: notes.trim() || null,
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setName('');
      setDosage('');
      setFrequency('');
      setNotes('');
      setIsModalVisible(false);
      Alert.alert('Success', 'Medication added successfully.');
      fetchMedications();
    } catch (err: any) {
      Alert.alert('Error Saving', err.message || 'Failed to save medication. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMedication = async (medId: string, medName: string) => {
    Alert.alert(
      'Delete Medication',
      `Are you sure you want to stop tracking ${medName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error: deleteError } = await supabase
                .from('medications')
                .delete()
                .eq('id', medId);

              if (deleteError) {
                throw new Error(deleteError.message);
              }

              Alert.alert('Deleted', 'Medication removed.');
              fetchMedications();
            } catch (err: any) {
              Alert.alert('Error Deleting', err.message || 'Failed to delete medication. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Group medications by time of day
  const times = ['Morning', 'Afternoon', 'Evening', 'Night'];
  const groupedMeds = times.reduce((groups: any, time: string) => {
    groups[time] = meds.filter((m) => m.time_of_day === time);
    return groups;
  }, {});
  const uncategorized = meds.filter((m) => !times.includes(m.time_of_day || ''));

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-slate-500 mt-2">Loading medications...</Text>
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

        {meds.length > 0 ? (
          <>
            {times.map((time) => {
              const currentGroup = groupedMeds[time] || [];
              if (currentGroup.length === 0) return null;

              return (
                <View key={time} className="mb-6">
                  <Text className="text-lg font-bold text-slate-800 mb-3 ml-2">{time} Dose</Text>
                  <View className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 space-y-1">
                    {currentGroup.map((med: any) => (
                      <View key={med.id} className="flex-row items-center justify-between py-3 border-b border-slate-50 last:border-b-0">
                        <View className="flex-row items-center flex-1">
                          <View className={`p-2 rounded-xl mr-3 ${time === 'Morning' ? 'bg-amber-50' : time === 'Evening' ? 'bg-indigo-50' : 'bg-blue-50'}`}>
                            <Pill color={time === 'Morning' ? '#D97706' : time === 'Evening' ? '#4F46E5' : '#2563EB'} size={24} />
                          </View>
                          <View className="flex-1 mr-2">
                            <Text className="font-bold text-slate-800 text-base">{med.name}</Text>
                            <Text className="text-sm text-slate-500 mt-0.5">{med.dosage} • {med.frequency}</Text>
                            {med.notes && <Text className="text-xs text-slate-400 mt-1 italic">Note: {med.notes}</Text>}
                          </View>
                        </View>
                        <TouchableOpacity 
                          onPress={() => handleDeleteMedication(med.id, med.name)}
                          className="p-2 bg-slate-50 rounded-full active:bg-rose-50"
                        >
                          <Trash2 color="#EF4444" size={18} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}

            {uncategorized.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-bold text-slate-800 mb-3 ml-2">Other Doses</Text>
                <View className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
                  {uncategorized.map((med: any) => (
                    <View key={med.id} className="flex-row items-center justify-between py-3 border-b border-slate-50 last:border-b-0">
                      <View className="flex-row items-center flex-1">
                        <View className="bg-slate-100 p-2 rounded-xl mr-3">
                          <Pill color="#475569" size={24} />
                        </View>
                        <View className="flex-1 mr-2">
                          <Text className="font-bold text-slate-800 text-base">{med.name}</Text>
                          <Text className="text-sm text-slate-500 mt-0.5">{med.dosage} • {med.frequency}</Text>
                          {med.notes && <Text className="text-xs text-slate-400 mt-1 italic">Note: {med.notes}</Text>}
                        </View>
                      </View>
                      <TouchableOpacity 
                        onPress={() => handleDeleteMedication(med.id, med.name)}
                        className="p-2 bg-slate-50 rounded-full active:bg-rose-50"
                      >
                        <Trash2 color="#EF4444" size={18} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        ) : (
          <View className="py-20 items-center justify-center bg-white rounded-3xl shadow-sm border border-slate-100">
            <Pill color="#94A3B8" size={60} className="mb-4" />
            <Text className="text-slate-700 text-lg font-bold">No Medications Logged</Text>
            <Text className="text-slate-400 text-center px-8 mt-1.5 leading-5">
              Add your medications here to keep track of your schedule and improve adherence.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Float Add Button */}
      <TouchableOpacity 
        onPress={() => setIsModalVisible(true)}
        className="absolute bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg shadow-blue-200 active:opacity-90"
      >
        <Plus color="white" size={28} />
      </TouchableOpacity>

      {/* Add Medication Modal */}
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
                <Pill color="#2563eb" size={24} className="mr-2" />
                <Text className="text-xl font-bold text-slate-800 ml-2">Add Medication</Text>
              </View>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} className="bg-slate-100 p-2 rounded-full">
                <X color="#64748B" size={20} />
              </TouchableOpacity>
            </View>

            <ScrollView className="space-y-4 mb-6" showsVerticalScrollIndicator={false}>
              <View className="mb-4">
                <Text className="text-slate-600 font-semibold mb-2">Medication Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Amlodipine, Sevelamer"
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-base"
                />
              </View>

              <View className="flex-row justify-between mb-4">
                <View className="flex-1 mr-2">
                  <Text className="text-slate-600 font-semibold mb-2">Dosage</Text>
                  <TextInput
                    value={dosage}
                    onChangeText={setDosage}
                    placeholder="e.g. 5mg, 1 Pill"
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-base"
                  />
                </View>
                <View className="flex-1 ml-2">
                  <Text className="text-slate-600 font-semibold mb-2">Frequency</Text>
                  <TextInput
                    value={frequency}
                    onChangeText={setFrequency}
                    placeholder="e.g. Once daily, Twice daily"
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-base"
                  />
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-slate-600 font-semibold mb-2">Time of Day</Text>
                <View className="flex-row flex-wrap gap-2">
                  {['Morning', 'Afternoon', 'Evening', 'Night'].map((time) => (
                    <TouchableOpacity
                      key={time}
                      onPress={() => setTimeOfDay(time)}
                      className={`px-4 py-2 rounded-full border ${timeOfDay === time ? 'bg-blue-900 border-blue-900' : 'bg-slate-50 border-slate-200'}`}
                    >
                      <Text className={timeOfDay === time ? 'text-white font-semibold' : 'text-slate-600'}>{time}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-slate-600 font-semibold mb-2">Instructions / Notes (Optional)</Text>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="e.g. Take with dinner, after food"
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-base"
                />
              </View>
            </ScrollView>

            <TouchableOpacity 
              onPress={handleAddMedication}
              disabled={saving}
              className="bg-blue-600 rounded-2xl py-4 flex-row justify-center items-center shadow-lg active:opacity-90"
            >
              {saving ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Save color="white" size={20} className="mr-2" />
                  <Text className="text-white font-bold text-lg ml-2">Save Medication</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
