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
import {store} from './store';
import Toast from 'react-native-toast-message';
import { navigationRef } from './utils/navigateRef'; // <-- import your navigation ref
import JobDetailScreen from './screens/profile/jobs/JobDetailScreen';
import './i18n'
import StoriesViewerScreen from './screens/StoriesViewerScreen';
import UserAuthScreen from './screens/user-auth';
import FullNameScreen from './screens/user-auth/FullName';
import UserDrawerNavigator from './components/UserDrawerNavigator';
 type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  EmployeePanel: undefined;
  Register: undefined;
  EmployProfile: undefined; // ✅ must match exactly with Stack.Screen name
  JobDetailsScreen: undefined;
  StoriesViewer: undefined;
  UserAuth: undefined,
  FullNameScreen: undefined,
  UserProfile: undefined,
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
              <Stack.Screen name="UserAuth" component={UserAuthScreen} />
              <Stack.Screen name='FullNameScreen' component={FullNameScreen} />
              <Stack.Screen name="EmployProfile" component={DrawerNavigator} />
              <Stack.Screen name="JobDetailsScreen" component={JobDetailScreen} />
              <Stack.Screen name='StoriesViewer' component={StoriesViewerScreen} />
              <Stack.Screen name='UserProfile' component={UserDrawerNavigator} />
        

            </Stack.Navigator>
          </NavigationContainer>

          {/* ✅ Place Toast *inside* SafeAreaProvider and GestureHandler, but *after* Navigation */}
          <Toast />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
};