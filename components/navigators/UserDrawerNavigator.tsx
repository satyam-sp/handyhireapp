// src/navigation/UserDrawerNavigator.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigator from './TabNavigator';
import CustomDrawerContent from './CustomDrawerContent'; // Import your custom drawer content component
import AddressManagementScreen from '../../screens/address/AddressManagement';

// You can add more screens like Settings, Logout etc.
// import SettingsScreen from '../../screens/SettingsScreen'; // Example
// import LogoutScreen from '../../screens/LogoutScreen'; // Example

const Drawer = createDrawerNavigator();

export default function UserDrawerNavigator() {
  return (
    <Drawer.Navigator
      // Use the custom drawer content component
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        // Set to true if you want the drawer itself to have a header.
        // This header will show the title of the active drawer screen and the hamburger icon.
        headerShown: false, // <-- IMPORTANT: Set this to true for the header with the hamburger icon
        headerStyle: { backgroundColor: '#075e54' },
        headerTintColor: '#000',
        drawerStyle: { backgroundColor: '#fff', width: 260 },
        drawerActiveTintColor: '#000',
        // Optional: Customize header title style
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Drawer.Screen
        name="MainApp"
        component={TabNavigator}
        options={{
          title: 'My Awesome App', // Title shown in the header when this screen is active
          drawerLabel: 'Home', // Label shown in the drawer menu itself (below the custom header)
          // You can also customize the icon for this drawer item
          // drawerIcon: ({ color, size }) => (
          //   <MaterialCommunityIcons name="home-account" size={size} color={color} />
          // ),
        }}
      />

      <Drawer.Screen
        name="AddressScreen"
        component={AddressManagementScreen}
        options={{
          title: 'Address', // Title shown in the header when this screen is active
          drawerLabel: 'Address', // Label shown in the drawer menu itself (below the custom header)
          // You can also customize the icon for this drawer item
          // drawerIcon: ({ color, size }) => (
          //   <MaterialCommunityIcons name="home-account" size={size} color={color} />
          // ),
        }}
      />

      {/* Add more individual items here for the drawer menu if needed: */}
      {/* <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} /> */}
      {/* <Drawer.Screen name="Logout" component={LogoutScreen} options={{ title: 'Logout' }} /> */}
    </Drawer.Navigator>
  );
}