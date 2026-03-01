import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import CameraScreen from './src/screens/CameraScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import InspectionReportScreen from './src/screens/InspectionReportScreen';
import { COLORS, FONT_SIZES } from './src/constants/theme';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: COLORS.surface,
  },
  headerTintColor: COLORS.primary,
  headerTitleStyle: {
    fontWeight: '800',
    fontSize: FONT_SIZES.lg,
  },
  headerShadowVisible: false,
  contentStyle: {
    backgroundColor: COLORS.background,
  },
  animation: 'slide_from_right',
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={screenOptions}>
          <Stack.Screen
            name="Camera"
            component={CameraScreen}
            options={{ title: 'Visual Parts ID' }}
          />
          <Stack.Screen
            name="Loading"
            component={LoadingScreen}
            options={{
              title: 'Analyzing...',
              headerBackVisible: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="Results"
            component={ResultsScreen}
            options={{
              title: 'Results',
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="InspectionReport"
            component={InspectionReportScreen}
            options={{
              title: 'Inspection Report',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}