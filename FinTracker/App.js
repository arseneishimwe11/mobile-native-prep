import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { ExpenseProvider } from './src/contexts/ExpenseContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </ExpenseProvider>
    </AuthProvider>
  );
}
