import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import PlayerScreen from '../screens/PlayerScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SavedScreen from '../screens/SavedScreen';
import PremiumScreen from '../screens/PremiumScreen';
import OfflineScreen from '../screens/OfflineScreen';
import RadioScreen from '../screens/RadioScreen';
import AccessResultScreen from '../screens/AccessResultScreen';
import AdminDashboard from '../screens/admin/AdminDashboard';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#0A0A1F' },
          animationEnabled: true,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="Player" component={PlayerScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="Saved" component={SavedScreen} />
        <Stack.Screen name="Premium" component={PremiumScreen} />
        <Stack.Screen name="Offline" component={OfflineScreen} />
        <Stack.Screen name="Radio" component={RadioScreen} />
        <Stack.Screen
          name="AccessResult"
          component={AccessResultScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboard}
          options={{ gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
