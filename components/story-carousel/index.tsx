import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Platform // Import Platform for conditional styling if needed
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons for the plus icon
import VideoProcessingAndUpload from '../upload/VideoProcessingAndUpload';
import { useSelector } from 'react-redux';
import EmpAvatar from '../../assets/svgs/employee-avatar.svg'

// Install react-native-vector-icons if you haven't:
// npm install react-native-vector-icons
// cd ios && pod install && cd ..
// For Android, follow setup guide for vector icons.

// Sample Grouped Story Data

// Static "Your Story" item
const YOUR_STORY_ITEM = {
  id: 'your_story',
  isYourStory: true, // Custom flag to identify this item
  stories: [], // Your story might be empty initially or contain your own existing stories
};

const StoriesListScreen: React.FC = () => {
  const videos = useSelector((state: any) => state.videoUpload.videos)
  const navigation = useNavigation();

  // Combine Your Story item with other user stories
  const groupedStoriesData = useMemo(() => videos?.map((video: any, index: string) => ({
        id: video.id,
        username: `Story ${index +1}`,
        stories: [
          { story_id: 's3', story_video: video?.url || video, type: 'video' },
        ],
      
  })),[videos])


  const allStoriesData = [YOUR_STORY_ITEM, ...groupedStoriesData];


  const handleStoryCirclePress = (item: any) => {
    if (item.isYourStory) {
      // Logic for "Your Story" - e.g., open camera, open your own story archive
      console.log("Add/View Your Story functionality here!");
      // For now, let's just show an alert or navigate to a placeholder screen
      if (item.stories && item.stories.length > 0) {
        navigation.navigate('StoriesViewer', { userStories: item });
      } else {
        // alert("This is where you'd add or view your own story!");
      }
    } else {
      // Logic for other users' stories
      navigation.navigate('StoriesViewer', { userStories: item });
    }
  };

  const renderImage = (url: any) =>{
    return !url ? <View style={styles.avatar}><EmpAvatar  width={60} /></View> : <Image source={{ uri: url }} style={styles.avatar} />
  }

  const renderStoryCircle = ({ item, index }: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.storyCircle}
      // Only allow pressing if it's NOT "Your Story", as VPAU handles its own press
      onPress={() => handleStoryCirclePress(item)}
      // Disable press if it's your story to avoid conflicts with VPAU's internal touch handler
      activeOpacity={item.isYourStory ? 1 : 0.7} // Prevent touch feedback for Your Story wrapper
    >
      {/* Conditionally render based on whether it's 'Your Story' or another user's story */}
      {item.isYourStory ? (
        // For 'Your Story', directly use VideoProcessingAndUpload
        <VideoProcessingAndUpload />
      ) : (
        // For other users, render the standard image
        renderImage(item.imgUrl)
      )}

      {/* The username text */}
      <Text style={styles.userName}>{item.username}</Text>
    </TouchableOpacity>
  );




  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Work Stories Feed</Text>
      <FlatList
        data={allStoriesData} // Use the combined data
        renderItem={renderStoryCircle}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
     
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
    color: '#333',
  },
  flatListContent: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  storyCircle: {
    alignItems: 'center',
    marginHorizontal: 8,
    position: 'relative', // Needed for absolute positioning of plus icon
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    borderWidth: 2.5,
    borderColor: '#ffd503', // Instagram story ring color
  },
  userName: {
    fontSize: 12,
    marginTop: 5,
    color: '#333',
  },
  plusIconContainer: {
    position: 'absolute',
    bottom: 15, // Adjust vertical position
    right: 0,   // Adjust horizontal position
    backgroundColor: 'white', // Background for the icon to make it pop
    borderRadius: 12, // Half of size for perfect circle
    padding: 1, // Small padding around the icon
    borderWidth: 1,
    borderColor: '#f5f5f5', // Match background or a subtle border
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  plusIcon: {
    // No specific styles needed here, Ionicons already handle size/color
  },
  mainContentText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  }
});

export default StoriesListScreen;