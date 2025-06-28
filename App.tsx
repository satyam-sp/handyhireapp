import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from './screens/RegisterScreen';
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import EmployeePanel from './screens/EmplyeePanel';
import EmployeeProfileScreen from './screens/profile/employee';
import DrawerNavigator from './components/DrawerNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from "react-redux";
import store from './store';
import Toast from 'react-native-toast-message';
import { navigationRef } from './utils/navigateRef'; // <-- import your navigation ref
import JobDetailScreen from './screens/profile/jobs/JobDetailScreen';
import './i18n'
 type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  EmployeePanel: undefined;
  Register: undefined;
  EmployProfile: undefined; // ✅ must match exactly with Stack.Screen name
  JobDetailsScreen: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Splash" component={SplashScreen} />
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="EmployeePanel" component={EmployeePanel} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="EmployProfile" component={DrawerNavigator} />
              <Stack.Screen name="JobDetailsScreen" component={JobDetailScreen} />

            </Stack.Navigator>
          </NavigationContainer>

          {/* ✅ Place Toast *inside* SafeAreaProvider and GestureHandler, but *after* Navigation */}
          <Toast />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
};