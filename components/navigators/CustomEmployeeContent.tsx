// src/navigation/CustomDrawerContent.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useDispatch } from 'react-redux';
import { logout } from '../../slices/register.slice'; // Adjust path as per your slice location

interface CustomEmployeeContentProps {
  // These props are passed by Drawer.Navigator
  navigation: any;
  state: any;
  descriptors: any;
}

export function CustomEmployeeContent(props: CustomEmployeeContentProps) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Logout cancelled"),
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: () => {
            dispatch(logout() as any); // Dispatch your Redux logout action
           
          },
          style: "destructive"
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        {/* You can add custom items here if needed, above the logout button */}
      </DrawerContentScrollView>
      <View style={styles.bottomDrawerSection}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomDrawerSection: {
    padding: 20,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  logoutButton: {
    backgroundColor: '#FF0000', // Red background for logout
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});