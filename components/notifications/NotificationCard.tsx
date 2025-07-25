// src/components/NotificationCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity , Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'; // Needed for .fromNow()
import { Colors } from '../../screens/users/styles';
dayjs.extend(relativeTime); // Extend dayjs with the plugin

interface NotificationCardProps {
  item: any;
  // Function to call when the card is pressed, likely to mark as read and/or navigate
  onPress: (id: number) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  item,
  onPress,
}) => {
    const { id,
        message,
        read,
        createdAt,
        jobTitle,
        image_url,
        senderName} = item.attributes
  const formattedTime = dayjs(createdAt).fromNow(); // e.g., "2 hours ago", "5 days ago"

  return (
    <TouchableOpacity
      style={[styles.card, read ? styles.readCard : styles.unreadCard]}
      onPress={() => onPress(id)}
    >
      <View style={styles.iconContainer}>
        {image_url && <Image source={{ uri: image_url }} style={styles.avatar} /> }
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.messageText} numberOfLines={2}>
          {message}
        </Text>
        {jobTitle && <Text style={styles.metaText}>Job: {jobTitle}</Text>}
        {senderName && <Text style={styles.metaText}>From: {senderName}</Text>}
        <Text style={styles.timeText}>{formattedTime}</Text>
      </View>
      {!read && (
        <View style={styles.unreadIndicator} /> // Visual indicator for unread
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 15,
    marginVertical: 7,
    borderRadius: 20,
    backgroundColor: '#fff',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowRadius: 0,
   // elevation: 0.1, // For Android shadow
  },
  unreadCard: {
    backgroundColor: 'rgba(146, 228, 213, 0.1)', // Highlight unread notifications
  },
  readCard: {
    backgroundColor: '#f5f5f5', // Slightly different background for read
  },
  iconContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    borderColor: Colors.accentBlue,
    borderWidth: 1,
    alignItems: 'center'
  },
  contentContainer: {
    flex: 1,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 5,
  },
  metaText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007bff',
    marginLeft: 10,
  },
});

export default NotificationCard;