import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import UserScreen from '../screens/users';

// You can add more screens like Settings, Logout etc.

const Drawer = createDrawerNavigator();

export default function UserDrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: '#f8e71c' },
        headerTintColor: '#000',
        drawerStyle: { backgroundColor: '#fff', width: 260 },
        drawerActiveTintColor: '#000',
      }}
    >
      <Drawer.Screen name="Home" component={UserScreen} />
    

      {/* Add more items here like: */}
      {/* <Drawer.Screen name="Settings" component={SettingsScreen} /> */}
    </Drawer.Navigator>
  );
}
