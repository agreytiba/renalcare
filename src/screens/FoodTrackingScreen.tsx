import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, ActivityIndicator, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Info, X, Save, ShieldAlert, Award, Sparkles } from 'lucide-react-native';
import { supabase } from '../api/supabase';
import { useStore } from '../store/useStore';

export default function FoodTrackingScreen() {
  const { t } = useTranslation();
  const { language } = useStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [foods, setFoods] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Detail Modal State
  const [selectedFood, setSelectedFood] = useState<any>(null);

  // Add Food Modal State
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [nameEn, setNameEn] = useState('');
  const [nameSw, setNameSw] = useState('');
  const [potassium, setPotassium] = useState('Low');
  const [sodium, setSodium] = useState('Low');
  const [sugar, setSugar] = useState('Low');
  const [phosphorus, setPhosphorus] = useState('Low');
  const [kidneyScore, setKidneyScore] = useState('8');
  const [diabetesScore, setDiabetesScore] = useState('8');
  const [analyzing, setAnalyzing] = useState(false);

  const analyzeWithGemini = async () => {
    if (!nameEn.trim()) {
      Alert.alert('Uchambuzi wa AI / AI Analysis', 'Tafadhali weka jina la chakula kwa Kiingereza kwanza.\n(Please enter the English food name first).');
      return;
    }

    setAnalyzing(true);
    try {
      const apiKey = (process.env.EXPO_PUBLIC_GEMINI_API_KEY || '').trim();
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw new Error('Gemini API key is not configured. Please add EXPO_PUBLIC_GEMINI_API_KEY in your .env file.');
      }

      const prompt = `You are a clinical renal dietitian assistant. Analyze the food or fruit named: "${nameEn.trim()}". Determine its safety levels for a chronic kidney disease (CKD) and diabetes patient.
Return a valid JSON object containing exactly these properties:
{
  "potassium_level": "Low" | "Medium" | "High",
  "sodium_level": "Low" | "Medium" | "High",
  "phosphorus_level": "Low" | "Medium" | "High",
  "sugar_impact": "Low" | "Medium" | "High",
  "kidney_safety_score": integer (1 to 10),
  "diabetes_safety_score": integer (1 to 10),
  "name_sw": "Swahili translation of the food/fruit name"
}
Do not return any markdown format, markdown backticks, or any conversational text. Return only raw, valid JSON.`;

      let response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      // Fallback to v1beta if v1 stable returns 404
      if (response.status === 404) {
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: prompt,
                    },
                  ],
                },
              ],
            }),
          }
        );
      }

      if (!response.ok) {
        throw new Error(`Gemini API error (Status ${response.status})`);
      }

      const result = await response.json();
      const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error('No analysis generated from Gemini.');
      }

      console.log('Gemini AI Raw Response:', rawText);

      // Robust JSON Extraction using Regex
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Response did not contain a valid JSON block.');
      }
      
      console.log('Gemini AI Extracted JSON:', jsonMatch[0]);
      const data = JSON.parse(jsonMatch[0]);
      console.log('Gemini AI Parsed Data:', data);

      if (data.name_sw) {
        setNameSw(data.name_sw);
      }
      if (data.potassium_level && ['Low', 'Medium', 'High'].includes(data.potassium_level)) {
        setPotassium(data.potassium_level);
      }
      if (data.sodium_level && ['Low', 'Medium', 'High'].includes(data.sodium_level)) {
        setSodium(data.sodium_level);
      }
      if (data.phosphorus_level && ['Low', 'Medium', 'High'].includes(data.phosphorus_level)) {
        setPhosphorus(data.phosphorus_level);
      }
      if (data.sugar_impact && ['Low', 'Medium', 'High'].includes(data.sugar_impact)) {
        setSugar(data.sugar_impact);
      }

      if (data.kidney_safety_score) {
        setKidneyScore(String(data.kidney_safety_score));
      }
      if (data.diabetes_safety_score) {
        setDiabetesScore(String(data.diabetes_safety_score));
      }

      Alert.alert('AI Success', `Uchambuzi umekamilika! Umejaza vigezo vya usalama vya "${nameEn}".\n(AI analysis complete! Loaded clinical safety metrics).`);
    } catch (err: any) {
      console.log('Gemini error', err);
      Alert.alert('AI Error', err.message || 'Shida imetokea wakati wa kuwasiliana na Gemini AI.\n(An error occurred while calling Gemini AI).');
    } finally {
      setAnalyzing(false);
    }
  };

  const fetchFoods = async (search: string = '') => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from('foods').select('*');

      if (search.trim()) {
        query = query.or(`name_en.ilike.%${search}%,name_sw.ilike.%${search}%`);
      }

      const { data, error: fetchError } = await query.limit(25);

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setFoods(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to search food database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods(searchText);
  }, [searchText]);

  const handleAddFood = async () => {
    if (!nameEn.trim() || !nameSw.trim()) {
      Alert.alert('Validation Error', 'Please enter food names in both English and Swahili.');
      return;
    }
    const kScore = parseInt(kidneyScore, 10);
    const dScore = parseInt(diabetesScore, 10);
    if (isNaN(kScore) || kScore < 1 || kScore > 10 || isNaN(dScore) || dScore < 1 || dScore > 10) {
      Alert.alert('Validation Error', 'Safety scores must be integers between 1 and 10.');
      return;
    }

    setSaving(true);
    try {
      const { error: insertError } = await supabase
        .from('foods')
        .insert({
          name_en: nameEn.trim(),
          name_sw: nameSw.trim(),
          potassium_level: potassium,
          sodium_level: sodium,
          sugar_impact: sugar,
          phosphorus_level: phosphorus,
          kidney_safety_score: kScore,
          diabetes_safety_score: dScore,
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setNameEn('');
      setNameSw('');
      setPotassium('Low');
      setSodium('Low');
      setSugar('Low');
      setPhosphorus('Low');
      setKidneyScore('8');
      setDiabetesScore('8');
      setIsAddModalVisible(false);
      Alert.alert('Success', 'Food item added to database successfully.');
      fetchFoods(searchText);
    } catch (err: any) {
      Alert.alert('Error Saving', err.message || 'Failed to add food. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getSafetyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return { text: 'text-rose-700', bg: 'bg-rose-100' };
      case 'medium':
        return { text: 'text-amber-700', bg: 'bg-amber-100' };
      case 'low':
      default:
        return { text: 'text-green-700', bg: 'bg-green-100' };
    }
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 8) return 'bg-emerald-500 text-white';
    if (score >= 5) return 'bg-amber-500 text-white';
    return 'bg-rose-500 text-white';
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Search Header */}
      <View className="p-4 bg-white border-b border-slate-100 flex-row items-center">
        <View className="flex-1 bg-slate-100 rounded-xl flex-row items-center px-3 py-2 mr-3 border border-slate-200">
          <Search color="#94A3B8" size={20} />
          <TextInput
            placeholder="Search food database..."
            placeholderTextColor="#94A3B8"
            value={searchText}
            onChangeText={setSearchText}
            className="flex-1 text-slate-800 text-base ml-2 py-0.5"
          />
          {searchText ? (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <X color="#94A3B8" size={16} />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          onPress={() => setIsAddModalVisible(true)}
          className="bg-green-500 w-11 h-11 rounded-xl items-center justify-center shadow-md shadow-green-200 active:opacity-90"
        >
          <Plus color="white" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView className="p-4">
        {error && (
          <View className="bg-rose-50 border border-rose-100 p-4 rounded-2xl mb-4">
            <Text className="text-rose-700 text-sm">{error}</Text>
          </View>
        )}

        {/* Nutrition Tip */}
        <View className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-6">
          <View className="flex-row items-start">
            <Info color="#F59E0B" size={24} className="mr-3 mt-1" />
            <View className="flex-1">
              <Text className="font-bold text-slate-800 mb-1">Kidney Nutrition Tip</Text>
              <Text className="text-slate-600 text-sm leading-5">
                Always prioritize foods labeled with a <Text className="font-bold text-green-600">Low Potassium</Text> and <Text className="font-bold text-green-600">Low Sodium</Text> content to preserve kidney function.
              </Text>
            </View>
          </View>
        </View>

        {/* Dynamic Foods List */}
        <View className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-8">
          <Text className="text-lg font-bold text-slate-800 mb-4">
            {searchText ? 'Search Results' : 'Recommended Foods'}
          </Text>

          {loading ? (
            <ActivityIndicator size="small" color="#10B981" className="py-6" />
          ) : foods.length > 0 ? (
            foods.map((food) => {
              const name = language === 'sw' ? food.name_sw : food.name_en;
              const kStyle = getSafetyColor(food.potassium_level);
              return (
                <TouchableOpacity
                  key={food.id}
                  onPress={() => setSelectedFood(food)}
                  className="flex-row justify-between items-center py-3.5 border-b border-slate-50 last:border-b-0"
                >
                  <View className="flex-1 mr-4">
                    <Text className="text-slate-800 font-bold text-base">{name}</Text>
                    <Text className="text-xs text-slate-400 mt-0.5">
                      Potassium: {food.potassium_level} • Sodium: {food.sodium_level}
                    </Text>
                  </View>
                  <View className={`${kStyle.bg} px-2.5 py-1 rounded-lg`}>
                    <Text className={`${kStyle.text} text-xs font-bold`}>
                      {food.potassium_level === 'Low' ? 'Safe' : food.potassium_level === 'Medium' ? 'Caution' : 'Avoid'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View className="py-8 items-center">
              <Text className="text-slate-400">No matching food items found.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Food Details Modal */}
      <Modal
        visible={selectedFood !== null}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedFood(null)}
      >
        <View className="flex-1 bg-black/60 justify-center p-6">
          <View className="bg-white rounded-3xl p-6 shadow-2xl">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-slate-800">
                {language === 'sw' ? selectedFood?.name_sw : selectedFood?.name_en}
              </Text>
              <TouchableOpacity onPress={() => setSelectedFood(null)} className="bg-slate-100 p-2 rounded-full">
                <X color="#64748B" size={18} />
              </TouchableOpacity>
            </View>

            {selectedFood && (
              <View className="space-y-4">
                {/* Safety Scores */}
                <View className="flex-row justify-between mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <View className="items-center flex-1 border-r border-slate-200">
                    <Text className="text-slate-400 text-xs uppercase mb-1">Kidney Safety</Text>
                    <View className={`px-3 py-1 rounded-full ${getScoreBadgeColor(selectedFood.kidney_safety_score)}`}>
                      <Text className="font-bold">{selectedFood.kidney_safety_score}/10</Text>
                    </View>
                  </View>
                  <View className="items-center flex-1">
                    <Text className="text-slate-400 text-xs uppercase mb-1">Diabetes Safety</Text>
                    <View className={`px-3 py-1 rounded-full ${getScoreBadgeColor(selectedFood.diabetes_safety_score)}`}>
                      <Text className="font-bold">{selectedFood.diabetes_safety_score}/10</Text>
                    </View>
                  </View>
                </View>

                {/* Mineral details */}
                <View className="space-y-3">
                  {[
                    { label: 'Potassium Level', val: selectedFood.potassium_level },
                    { label: 'Sodium Level', val: selectedFood.sodium_level },
                    { label: 'Phosphorus Level', val: selectedFood.phosphorus_level },
                    { label: 'Sugar Impact', val: selectedFood.sugar_impact },
                  ].map((item, idx) => {
                    const badgeStyle = getSafetyColor(item.val);
                    return (
                      <View key={idx} className="flex-row justify-between items-center py-2 border-b border-slate-50">
                        <Text className="font-medium text-slate-600">{item.label}</Text>
                        <View className={`${badgeStyle.bg} px-3 py-1 rounded-full`}>
                          <Text className={`${badgeStyle.text} font-bold text-sm`}>{item.val}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>

                {/* Safety Advice */}
                {selectedFood.potassium_level === 'High' && (
                  <View className="mt-4 bg-rose-50 border border-rose-100 p-4 rounded-xl flex-row items-start">
                    <ShieldAlert color="#EF4444" size={20} className="mr-2.5 mt-0.5" />
                    <Text className="text-rose-700 text-xs flex-1 leading-4">
                      This food is high in potassium. High potassium levels can disrupt heart rhythms for dialysis patients. Consume with extreme caution or avoid.
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Add Food Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[40px] p-6 max-h-[90%] shadow-2xl">
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row items-center">
                <Award color="#10B981" size={24} className="mr-2" />
                <Text className="text-xl font-bold text-slate-800 ml-2">Add New Food Item</Text>
              </View>
              <TouchableOpacity onPress={() => setIsAddModalVisible(false)} className="bg-slate-100 p-2 rounded-full">
                <X color="#64748B" size={20} />
              </TouchableOpacity>
            </View>

            <ScrollView className="space-y-4 mb-6" showsVerticalScrollIndicator={false}>
              <View className="mb-3">
                <Text className="text-slate-600 font-semibold mb-2">Food Name (English)</Text>
                <View className="flex-row gap-2">
                  <TextInput
                    value={nameEn}
                    onChangeText={setNameEn}
                    placeholder="e.g. Apple"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-base"
                  />
                  <TouchableOpacity
                    onPress={analyzeWithGemini}
                    disabled={analyzing}
                    className="bg-blue-600 px-4 rounded-2xl justify-center items-center active:opacity-90 flex-row"
                  >
                    {analyzing ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <>
                        <Sparkles color="white" size={16} />
                        <Text className="text-white font-bold ml-1.5 text-xs">Gemini AI</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View className="mb-3">
                <Text className="text-slate-600 font-semibold mb-2">Food Name (Swahili)</Text>
                <TextInput
                  value={nameSw}
                  onChangeText={setNameSw}
                  placeholder="e.g. Tofaha"
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-base"
                />
              </View>

              {/* Dropdown/Pills for safe minerals selection */}
              {['Potassium', 'Sodium', 'Phosphorus', 'Sugar'].map((mineral) => {
                const currentVal = mineral === 'Potassium' ? potassium
                  : mineral === 'Sodium' ? sodium
                    : mineral === 'Phosphorus' ? phosphorus
                      : sugar;
                const setVal = mineral === 'Potassium' ? setPotassium
                  : mineral === 'Sodium' ? setSodium
                    : mineral === 'Phosphorus' ? setPhosphorus
                      : setSugar;

                return (
                  <View key={mineral} className="mb-3">
                    <Text className="text-slate-600 font-semibold mb-1.5">{mineral} level</Text>
                    <View className="flex-row gap-2">
                      {['Low', 'Medium', 'High'].map((lvl) => (
                        <TouchableOpacity
                          key={lvl}
                          onPress={() => setVal(lvl)}
                          className={`px-4 py-2 rounded-full border ${currentVal === lvl ? 'bg-green-500 border-green-500' : 'bg-slate-50 border-slate-200'}`}
                        >
                          <Text className={currentVal === lvl ? 'text-white font-semibold' : 'text-slate-600'}>{lvl}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                );
              })}

              {/* Safety scores */}
              <View className="flex-row justify-between mb-4">
                <View className="flex-1 mr-2">
                  <Text className="text-slate-600 font-semibold mb-1.5">Kidney Score (1-10)</Text>
                  <TextInput
                    value={kidneyScore}
                    onChangeText={setKidneyScore}
                    keyboardType="numeric"
                    placeholder="8"
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-base font-bold text-center"
                  />
                </View>
                <View className="flex-1 ml-2">
                  <Text className="text-slate-600 font-semibold mb-1.5">Diabetes Score (1-10)</Text>
                  <TextInput
                    value={diabetesScore}
                    onChangeText={setDiabetesScore}
                    keyboardType="numeric"
                    placeholder="8"
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-base font-bold text-center"
                  />
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={handleAddFood}
              disabled={saving}
              className="bg-green-500 rounded-2xl py-4 flex-row justify-center items-center shadow-lg active:opacity-90"
            >
              {saving ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Save color="white" size={20} className="mr-2" />
                  <Text className="text-white font-bold text-lg ml-2">Add Food to DB</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
