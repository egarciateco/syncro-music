import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { useAdminStore } from './src/store/adminStore';

export default function App() {
  const { loadConfig } = useAdminStore();

  useEffect(() => {
    loadConfig();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="#0A0A1F" />
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
