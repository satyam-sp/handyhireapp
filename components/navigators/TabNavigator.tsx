import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    createBottomTabNavigator,
    BottomTabBarProps, // Import for typing custom tab bar button
} from '@react-navigation/bottom-tabs';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated, // Import Animated API
    Pressable // For overlay to detect outside clicks,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // To navigate from sub-buttons
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchIcon from 'react-native-vector-icons/Ionicons';
import NotificationIcon from 'react-native-vector-icons/MaterialIcons';
import ProfileIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // For Job/Instant icons


import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import your screens
import HomeScreen from '../../screens/users'; // Using HomeScreen as a placeholder for all tabs
import { Dimensions } from 'react-native';
import { Easing } from 'react-native-reanimated';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from '../../slices/userAuth.slice';
import NotificationListScreen from '../../screens/notifications';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window'); // Or 'screen' depending on your need

// --- Sub-Button Component ---
interface SubButtonProps {
    label: string;
    iconName: string;
    onPress: () => void;
    animatedStyle: any; // For animation
}

const SubButton: React.FC<SubButtonProps> = ({ label, iconName, onPress, animatedStyle }) => (
    <Animated.View style={[styles.subButtonContainer, animatedStyle]}>
        <TouchableOpacity style={styles.subButton} onPress={onPress}>
            <MaterialCommunityIcons name={iconName} size={20} color="#075e54" />
            <Text style={styles.subButtonText}>{label}</Text>
        </TouchableOpacity>
    </Animated.View>
);

// --- Custom Plus Button Component ---

const CustomPlusButton: React.FC<any> = ({ children, onPress, rotateAnim }) => {
    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '135deg'], // Rotate 135 degrees
    });

    return (
        <TouchableOpacity
            style={{
                top: -30,
                justifyContent: 'center',
                alignItems: 'center',
                ...styles.shadow,
            }}
            onPress={onPress}
        >
            <Animated.View style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: '#075e54', // Pink color
                transform: [{ rotate: rotate }], // Apply rotation here
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                {children}
            </Animated.View>
        </TouchableOpacity>
    );
};

const TabNavigator = () => {
    const navigation = useNavigation(); // Get navigation object for sub-buttons
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch()
    const [showSubButtons, setShowSubButtons] = useState(false);
    const rotateAnim = useRef(new Animated.Value(0)).current; // For Plus button rotation
    const jobButtonAnim = useRef(new Animated.Value(0)).current; // For Job button vertical position/opacity
    const instantJobButtonAnim = useRef(new Animated.Value(0)).current; // For Instant Job button vertical position/opacity
    useEffect(() => {
        dispatch(getCurrentUser() as any)
    },[])
   
    // Function to animate showing/hiding sub-buttons
    const toggleSubButtons = useCallback(() => {
        const toValue = showSubButtons ? 0 : 1;

        Animated.parallel([
            Animated.timing(rotateAnim, {
                toValue,
                duration: 300,
                easing: Easing.out(Easing.cubic), // Example: Starts fast, slows down at end
                useNativeDriver: true,
            }),
            Animated.timing(jobButtonAnim, {
                toValue,
                duration: 200,
                delay: showSubButtons ? 0 : 100,
                easing: Easing.in(Easing.cubic), // Example: Starts fast, slows down at end
                useNativeDriver: true,
            }),
            Animated.timing(instantJobButtonAnim, {
                toValue,
                duration: 200,
                easing: Easing.in(Easing.cubic), // Example: Starts fast, slows down at end
                delay: showSubButtons ? 0 : 50, // Delay appearance slightly more
                useNativeDriver: true,
            }),
        ]).start(() => {
            setShowSubButtons(!showSubButtons);
        });
    }, [showSubButtons, rotateAnim, jobButtonAnim, instantJobButtonAnim]);


    const handlePlusButtonClick = () => {
        toggleSubButtons(); // Toggle visibility and animation
    };

    const handleJobPost = () => {
        toggleSubButtons(); // Hide sub-buttons
        // navigation.navigate('JobPost'); // Navigate to Job Post screen
    };

    const handleInstantJobPost = () => {
        toggleSubButtons(); // Hide sub-buttons
        navigation.navigate('InstantJobPost'); // Navigate to Instant Job Post screen
    };

    // Interpolate animation values for sub-buttons
    const jobButtonAnimatedStyle = {
        opacity: jobButtonAnim,
        transform: [
            {
                translateY: jobButtonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -30], // Move up 70 units
                }),
            },
        ],
    };

    const instantJobButtonAnimatedStyle = {
        opacity: instantJobButtonAnim,
        transform: [
            {
                translateY: instantJobButtonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -30], // Move up 140 units (70 for first, 70 for second)
                }),
            },
        ],
    };

    // To ensure animations are correctly set when `showSubButtons` state changes
    useEffect(() => {
        if (showSubButtons) {
            // No need to explicitly start here as toggleSubButtons handles it
            // but this useEffect can be used if there's external state changes
        } else {
            // When hiding, immediately set opacity to 0
            jobButtonAnim.setValue(0);
            instantJobButtonAnim.setValue(0);
            rotateAnim.setValue(0); // Reset plus button rotation
        }
    }, [showSubButtons, jobButtonAnim, instantJobButtonAnim, rotateAnim]);


    return (
        <React.Fragment>
            {/* Overlay to detect clicks outside the FAB menu */}
            {showSubButtons && (
                <Pressable style={styles.overlay} onPress={toggleSubButtons} />
            )}

            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    unmountOnBlur: true,
                    tabBarShowLabel: true,
                    tabBarStyle: {
                        position: 'absolute',
                        bottom: 0, // Stick to the bottom
                        left: 0,
                        right: 0,
                        backgroundColor: '#ffffff',
                        height: 55 + insets.bottom,
                        paddingBottom: insets.bottom,
                        ...styles.shadow,
                    },
                    tabBarItemStyle: {
                        marginHorizontal: 5,
                    },
                    tabBarActiveTintColor: '#075e54',
                    tabBarInactiveTintColor: '#748c94',
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <HomeIcon name="home" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Search"
                    component={HomeScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <SearchIcon name="search" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Plus"
                    // We don't assign a component here directly, as it's just a button
                    // The actual screens are navigated to from sub-buttons
                    component={HomeScreen} // Placeholder, it won't be rendered directly
                    options={{
                        tabBarButton: (props) => (
                            <CustomPlusButton {...props} onPress={handlePlusButtonClick} rotateAnim={rotateAnim}>
                                <Icon name="plus" size={30} color="#fff" />
                            </CustomPlusButton>
                        ),
                        tabBarLabel: () => null,
                    }}
                />
                <Tab.Screen
                    name="Notification"
                    component={NotificationListScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <NotificationIcon name="notifications" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={HomeScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <ProfileIcon name="user" color={color} size={size} />
                        ),
                    }}
                />
            </Tab.Navigator>

            {/* Render sub-buttons outside of Tab.Navigator for absolute positioning */}
            {showSubButtons && (
                <View style={styles.fabMenuContainer}>

                    <SubButton
                        label="Job Post"
                        iconName="briefcase" // Example icon
                        onPress={handleJobPost}
                        animatedStyle={jobButtonAnimatedStyle}
                    />
                    <SubButton
                        label="Instant Job Post"
                        iconName="flash" // Example icon
                        onPress={handleInstantJobPost}
                        animatedStyle={instantJobButtonAnimatedStyle}
                    />
                </View>
            )}
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#7F5DF0',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)', // Semi-transparent background
        zIndex: 1, // Ensure it's above other content but below the FAB menu
    },
    fabMenuContainer: {
        position: 'absolute',
        bottom: 55 + 20, // Base height of tab bar + safe area + margin from tab bar
        alignSelf: 'center', // Center horizontally above the tab bar
        alignItems: 'flex-end', // Align sub-buttons to the right if they stack
        zIndex: 2, // Ensure it's above the overlay
    },
    subButtonContainer: {
        marginBottom: 10, // Spacing between sub-buttons
        marginLeft: width - 200
    },
    subButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF', // Purple color for sub-buttons
        borderRadius: 25,
        justifyContent: 'flex-end',
        paddingVertical: 10,
        paddingLeft: 10,
        minWidth: 100,
        paddingRight: 20,
        shadowColor: '#7F5DF0',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    subButtonText: {
        color: '#075e54',
        marginLeft: 8,
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default TabNavigator;