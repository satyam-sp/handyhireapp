// src/navigation/CustomDrawerContent.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerContentComponentProps, // Import the type for props
} from '@react-navigation/drawer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store'; // Adjust path as needed for your RootState
import { logout } from '../../slices/register.slice';

// Optional: If you use MaterialCommunityIcons for drawer icons
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
    const { user }: any = useSelector((state: RootState) => state.userAuth);
    const dispatch = useDispatch()

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

    // Default profile photo if none is available
    const defaultProfilePhoto = require('../../assets/svgs/employee-avatar.svg'); // Make sure you have a default image here
    // Example: If your API returns a full URL or a relative path
    const profilePhotoUri = user?.profile_photo
        ? { uri: user.profile_photo }
        : defaultProfilePhoto;

    return (
        <View style={styles.container}>
            {/* Drawer Header with Profile Photo and Name */}
            <View style={styles.profileContainer}>
                <Image
                    source={profilePhotoUri}
                    style={styles.profileImage}
                />
                <Text style={styles.profileName}>
                    {user?.full_name || 'Guest User'}
                </Text>
                {/* You can add more user info here if needed, e.g., email or mobile */}
                {/* <Text style={styles.profileInfo}>{user?.mobile_number}</Text> */}
            </View>

            {/* Scrollable area for drawer items */}
            <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerScrollView}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
            <View style={styles.bottomDrawerSection}>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', // Or match your drawer background
    },
    profileContainer: {
        padding: 20,
        backgroundColor: '#f8e71c', // Background color for the header section
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50, // Adjust for status bar/top padding
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50, // Makes it round
        borderWidth: 2,
        borderColor: '#fff', // White border around photo
        marginBottom: 10,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold', // Make name bold
        color: '#000', // Text color
        marginBottom: 5,
    },
    profileInfo: {
        fontSize: 14,
        color: '#333',
    },
    drawerScrollView: {
        // Adjust padding for scrollable content if needed
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

export default CustomDrawerContent;