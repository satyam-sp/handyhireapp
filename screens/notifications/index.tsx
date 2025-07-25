// src/screens/NotificationListScreen.tsx
import React, { useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store'; // Adjust path as needed
import { getNotifications, markNotificationAsRead } from '../../slices/notifications.slice';
import NotificationCard from '../../components/notifications/NotificationCard'; // Adjust path as needed
import AppLoader from '../../components/loader/FullLoader'; // Assuming you have a full screen loader
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // useFocusEffect for refetch on focus

const NotificationListScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { notifications, loading, error, unreadCount } = useSelector((state: RootState) => state.notifications);
  // Fetch notifications when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      dispatch(getNotifications());
    }, [dispatch])
  );

  const handleNotificationPress = (id: number) => {
    dispatch(markNotificationAsRead(id));
  };

  if (loading) {
    return <AppLoader />; // Show a full-screen loader while loading
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Error loading notifications: {error}</Text>
        <TouchableOpacity onPress={() => dispatch(getNotifications())} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Tap to Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      {notifications.length === 0 ? (
        <View style={styles.centeredContainer}>
          <Ionicons name="notifications-off-outline" size={60} color="#ccc" />
          <Text style={styles.noNotificationsText}>No notifications yet!</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <NotificationCard
              item={item}
              onPress={handleNotificationPress}
            />
          )}
          contentContainerStyle={styles.listContentContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5', // Light background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    paddingTop: Platform.OS === 'ios' ? 50 : 20, // Adjust for iOS notch/status bar
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2, // Android shadow
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1, // Takes remaining space
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noNotificationsText: {
    fontSize: 18,
    color: '#888',
    marginTop: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContentContainer: {
    paddingVertical: 10,
    // Add bottom padding if your last item is too close to bottom UI elements
    paddingBottom: 20, 
  },
});

export default NotificationListScreen;