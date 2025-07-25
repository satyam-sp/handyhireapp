import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import EmployeeProfileScreen from '../../screens/profile/employee';
import WalletScreen from '../../screens/profile/WalletSection';
import JobsScreen from '../../screens/profile/jobs/JobsScreen';
import { CustomEmployeeContent } from './CustomEmployeeContent';
// You can add more screens like Settings, Logout etc.

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomEmployeeContent {...props} />} // <-- Add this line

      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#f8e71c' },
        headerTintColor: '#000',
        drawerStyle: { backgroundColor: '#fff', width: 260 },
        drawerActiveTintColor: '#000',
      }}
    >
      <Drawer.Screen name="Profile" component={EmployeeProfileScreen} />
      <Drawer.Screen name="Wallet" component={WalletScreen} />
      <Drawer.Screen name="Jobs" component={JobsScreen} />

      

      {/* Add more items here like: */}
      {/* <Drawer.Screen name="Settings" component={SettingsScreen} /> */}
    </Drawer.Navigator>
  );
}
