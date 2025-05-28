import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import BookBusScreen from './src/screens/BookBusScreen';
import MyBookingsScreen from './src/screens/MyBookingsScreen';
import { BookingProvider } from './src/context/BookingContext';
import { RootStackParamList } from './src/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <BookingProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: '#f9f9f9' },
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
            <Stack.Screen name="BookBus" component={BookBusScreen} />
            <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </BookingProvider>
    </SafeAreaProvider>
  );
}