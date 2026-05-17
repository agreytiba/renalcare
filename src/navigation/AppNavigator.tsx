import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { Home, Activity, Droplets, Apple, User } from 'lucide-react-native';

import { useStore } from '../store/useStore';
import { supabase } from '../api/supabase';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import FoodTrackingScreen from '../screens/FoodTrackingScreen';
import BloodSugarScreen from '../screens/BloodSugarScreen';
import DialysisScreen from '../screens/DialysisScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';

// Secondary Screens
import MedicationScreen from '../screens/MedicationScreen';
import WaterIntakeScreen from '../screens/WaterIntakeScreen';
import EmergencyCardScreen from '../screens/EmergencyCardScreen';
import EducationScreen from '../screens/EducationScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#1E3A8A' },
        headerTintColor: '#fff',
        tabBarActiveTintColor: '#1E3A8A',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 10,
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{
          title: t('dashboard'),
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }} 
      />
      <Tab.Screen 
        name="Food" 
        component={FoodTrackingScreen} 
        options={{
          title: t('food_tracking'),
          tabBarIcon: ({ color, size }) => <Apple color={color} size={size} />
        }} 
      />
      <Tab.Screen 
        name="BloodSugar" 
        component={BloodSugarScreen} 
        options={{
          title: t('blood_sugar'),
          tabBarIcon: ({ color, size }) => <Activity color={color} size={size} />
        }} 
      />
      <Tab.Screen 
        name="Dialysis" 
        component={DialysisScreen} 
        options={{
          title: t('dialysis'),
          tabBarIcon: ({ color, size }) => <Droplets color={color} size={size} />
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          title: t('profile'),
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />
        }} 
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { session, setSession } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null; // Or a loading screen

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="Medication" component={MedicationScreen} options={{ headerShown: true, title: 'Medications', headerStyle: { backgroundColor: '#1E3A8A' }, headerTintColor: '#fff' }} />
            <Stack.Screen name="WaterIntake" component={WaterIntakeScreen} options={{ headerShown: true, title: 'Water Intake', headerStyle: { backgroundColor: '#1E3A8A' }, headerTintColor: '#fff' }} />
            <Stack.Screen name="Emergency" component={EmergencyCardScreen} options={{ headerShown: true, title: 'Emergency SOS', headerStyle: { backgroundColor: '#E11D48' }, headerTintColor: '#fff' }} />
            <Stack.Screen name="Education" component={EducationScreen} options={{ headerShown: true, title: 'Education & Community', headerStyle: { backgroundColor: '#1E3A8A' }, headerTintColor: '#fff' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
