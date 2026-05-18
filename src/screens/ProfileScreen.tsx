import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, Modal, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { User, Settings, LogOut, ShieldAlert, Globe, BookOpen, Edit, Save, X } from 'lucide-react-native';
import { supabase } from '../api/supabase';
import { useStore } from '../store/useStore';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const { setLanguage, language, user } = useStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Profile state from DB
  const [profile, setProfile] = useState<any>(null);

  // Form states for editing
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [diabetesType, setDiabetesType] = useState('None');
  const [dialysisType, setDialysisType] = useState('None');

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        // If profile doesn't exist yet, that's fine (we will let them create one)
        if (fetchError.code === 'PGRST116') {
          setProfile(null);
        } else {
          setError(fetchError.message);
        }
      } else {
        setProfile(data);
        // Pre-populate form fields
        setFullName(data.full_name || '');
        setAge(data.age ? String(data.age) : '');
        setGender(data.gender || '');
        setWeight(data.weight ? String(data.weight) : '');
        setHeight(data.height ? String(data.height) : '');
        setDiabetesType(data.diabetes_type || 'None');
        setDialysisType(data.dialysis_type || 'None');
      }
    } catch (err: any) {
      setError('Failed to load profile. Please pull to refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err: any) {
      Alert.alert('Logout Error', 'Failed to log out. Please try again.');
    }
  };

  const toggleLanguage = async () => {
    const newLang = language === 'en' ? 'sw' : 'en';
    try {
      i18n.changeLanguage(newLang);
      setLanguage(newLang);
      if (user && profile) {
        // Try to update preferred language in Supabase
        await supabase
          .from('users')
          .update({ preferred_language: newLang })
          .eq('id', user.id);
      }
    } catch (err) {
      console.log('Language update ignored silently');
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);

    const parsedAge = age ? parseInt(age, 10) : null;
    const parsedWeight = weight ? parseFloat(weight) : null;
    const parsedHeight = height ? parseFloat(height) : null;

    if (parsedAge !== null && isNaN(parsedAge)) {
      Alert.alert('Validation Error', 'Age must be a valid number.');
      setSaving(false);
      return;
    }
    if (parsedWeight !== null && isNaN(parsedWeight)) {
      Alert.alert('Validation Error', 'Weight must be a valid number.');
      setSaving(false);
      return;
    }
    if (parsedHeight !== null && isNaN(parsedHeight)) {
      Alert.alert('Validation Error', 'Height must be a valid number.');
      setSaving(false);
      return;
    }

    const updatedProfile = {
      id: user.id,
      full_name: fullName.trim(),
      age: parsedAge,
      gender: gender.trim(),
      weight: parsedWeight,
      height: parsedHeight,
      diabetes_type: diabetesType,
      dialysis_type: dialysisType,
      preferred_language: language,
    };

    try {
      const { error: upsertError } = await supabase
        .from('users')
        .upsert(updatedProfile);

      if (upsertError) {
        throw new Error(upsertError.message);
      }

      setProfile(updatedProfile);
      setIsEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully.');
    } catch (err: any) {
      Alert.alert('Save Error', err.message || 'Failed to save profile. Please check your connection.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-50">
        <ActivityIndicator size="large" color="#1E3A8A" />
        <Text className="text-slate-500 mt-2">Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-50">
      {/* Header Banner */}
      <View className="bg-blue-900 p-8 pb-12 rounded-b-[40px] items-center shadow-lg relative">
        <TouchableOpacity 
          className="absolute top-4 right-4 bg-blue-800/60 p-2 rounded-full"
          onPress={() => setIsEditModalVisible(true)}
        >
          <Edit color="white" size={20} />
        </TouchableOpacity>

        <View className="w-24 h-24 bg-white rounded-full items-center justify-center mb-4 shadow-sm">
          <User color="#1E3A8A" size={48} />
        </View>
        <Text className="text-2xl font-bold text-white mb-1">
          {profile?.full_name || user?.email?.split('@')[0] || 'Health Warrior'}
        </Text>
        <Text className="text-blue-200 font-medium">
          {profile?.diabetes_type && profile?.diabetes_type !== 'None' ? `${profile.diabetes_type} Diabetes` : 'No Diabetes'} • {profile?.dialysis_type && profile?.dialysis_type !== 'None' ? profile.dialysis_type : 'No Dialysis'}
        </Text>
      </View>

      {/* Info Cards */}
      <View className="px-4 -mt-6">
        {error && (
          <View className="bg-rose-50 border border-rose-100 p-4 rounded-2xl mb-4">
            <Text className="text-rose-700 text-sm">{error}</Text>
          </View>
        )}

        <View className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-4 flex-row justify-between">
          <View className="items-center flex-1 border-r border-slate-100">
            <Text className="text-slate-400 text-xs uppercase mb-1">Age</Text>
            <Text className="text-lg font-bold text-slate-700">{profile?.age ? `${profile.age} yrs` : '--'}</Text>
          </View>
          <View className="items-center flex-1 border-r border-slate-100">
            <Text className="text-slate-400 text-xs uppercase mb-1">Weight</Text>
            <Text className="text-lg font-bold text-slate-700">{profile?.weight ? `${profile.weight} kg` : '--'}</Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-slate-400 text-xs uppercase mb-1">Height</Text>
            <Text className="text-lg font-bold text-slate-700">{profile?.height ? `${profile.height} cm` : '--'}</Text>
          </View>
        </View>

        {/* Options List */}
        <View className="bg-white rounded-3xl p-2 shadow-sm border border-slate-100 mb-4">
          <TouchableOpacity className="flex-row items-center p-4 border-b border-slate-50" onPress={toggleLanguage}>
            <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-4">
              <Globe color="#3B82F6" size={20} />
            </View>
            <View className="flex-1">
              <Text className="text-slate-800 font-bold text-lg">Language</Text>
              <Text className="text-slate-500">{language === 'en' ? 'English' : 'Swahili'}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center p-4 border-b border-slate-50"
            onPress={() => navigation.navigate('Education' as never)}
          >
            <View className="w-10 h-10 bg-green-50 rounded-full items-center justify-center mr-4">
              <BookOpen color="#16A34A" size={20} />
            </View>
            <Text className="flex-1 text-slate-800 font-bold text-lg">Education & Community</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center p-4 border-b border-slate-50"
            onPress={() => navigation.navigate('Emergency' as never)}
          >
            <View className="w-10 h-10 bg-red-50 rounded-full items-center justify-center mr-4">
              <ShieldAlert color="#EF4444" size={20} />
            </View>
            <Text className="flex-1 text-slate-800 font-bold text-lg">{t('emergency')}</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-4" onPress={handleLogout}>
            <View className="w-10 h-10 bg-rose-50 rounded-full items-center justify-center mr-4">
              <LogOut color="#F43F5E" size={20} />
            </View>
            <Text className="flex-1 text-rose-500 font-bold text-lg">Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[40px] p-6 max-h-[90%] shadow-2xl">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-slate-800">Edit Profile</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)} className="bg-slate-100 p-2 rounded-full">
                <X color="#64748B" size={20} />
              </TouchableOpacity>
            </View>

            <ScrollView className="space-y-4 mb-6" showsVerticalScrollIndicator={false}>
              <View className="mb-4">
                <Text className="text-slate-600 font-semibold mb-2">Full Name</Text>
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter full name"
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-base"
                />
              </View>

              <View className="flex-row justify-between mb-4">
                <View className="flex-1 mr-2">
                  <Text className="text-slate-600 font-semibold mb-2">Age</Text>
                  <TextInput
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                    placeholder="e.g. 45"
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-base"
                  />
                </View>
                <View className="flex-1 ml-2">
                  <Text className="text-slate-600 font-semibold mb-2">Gender</Text>
                  <TextInput
                    value={gender}
                    onChangeText={setGender}
                    placeholder="e.g. Male"
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-base"
                  />
                </View>
              </View>

              <View className="flex-row justify-between mb-4">
                <View className="flex-1 mr-2">
                  <Text className="text-slate-600 font-semibold mb-2">Weight (kg)</Text>
                  <TextInput
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                    placeholder="e.g. 70"
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-base"
                  />
                </View>
                <View className="flex-1 ml-2">
                  <Text className="text-slate-600 font-semibold mb-2">Height (cm)</Text>
                  <TextInput
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="numeric"
                    placeholder="e.g. 175"
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-base"
                  />
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-slate-600 font-semibold mb-2">Diabetes Type</Text>
                <View className="flex-row flex-wrap gap-2">
                  {['None', 'Type 1', 'Type 2', 'Gestational'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => setDiabetesType(type)}
                      className={`px-4 py-2 rounded-full border ${diabetesType === type ? 'bg-blue-900 border-blue-900' : 'bg-slate-50 border-slate-200'}`}
                    >
                      <Text className={diabetesType === type ? 'text-white font-semibold' : 'text-slate-600'}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-slate-600 font-semibold mb-2">Dialysis Type</Text>
                <View className="flex-row flex-wrap gap-2">
                  {['None', 'Hemodialysis', 'Peritoneal'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => setDialysisType(type)}
                      className={`px-4 py-2 rounded-full border ${dialysisType === type ? 'bg-blue-900 border-blue-900' : 'bg-slate-50 border-slate-200'}`}
                    >
                      <Text className={dialysisType === type ? 'text-white font-semibold' : 'text-slate-600'}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity 
              onPress={handleSaveProfile}
              disabled={saving}
              className="bg-blue-900 rounded-2xl py-4 flex-row justify-center items-center shadow-lg active:opacity-90"
            >
              {saving ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Save color="white" size={20} className="mr-2" />
                  <Text className="text-white font-bold text-lg ml-2">Save Profile</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
