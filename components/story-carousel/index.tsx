import React, { useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native';
import InstaStory from 'react-native-insta-story';

const { width, height } = Dimensions.get('window');

// Data structure for react-native-story-view (slightly different)
const data = [
    {
      user_id: 1,
      user_image:
        'https://pbs.twimg.com/profile_images/1222140802475773952/61OmyINj.jpg',
      user_name: 'Ahmet Çağlar Durmuş',
      stories: [
        {
          story_id: 1,
          story_image:
            'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          type: 'video', // <-- Important: Define type as 'video'
          duration: 15
        },
      ],
    }
  
  ];
  

const StoriesListScreen: React.FC = () => {


  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Stories Feed (using react-native-story-view)</Text>
      
      <InstaStory
          data={data}
          duration={10} // Default duration for image stories in seconds (can be overridden per story)
          avatarSize={50}
          onPress={() => console.log('Story press')} // Example callback
          unPressedBorderColor="#E1306C" // Color for unseen stories
          pressedBorderColor="#833AB4" // Color for seen stories
          videoComponent={({ story, defaultStyles }) => {
            // You can render your own react-native-video component here
            return (
              <Video
                source={{ uri: story.story_video }}
                style={defaultStyles.storyVideo} // Use default styling or your own
                resizeMode="contain"
                controls={false}
                paused={false}
                repeat={false}
              />
            );
          }}
          videoAnimationDuration={200} // milliseconds
          // You can customize more here (e.g., progress colors, header components)
          // `videoComponent` for custom video player, `videoAnimationDuration` etc.
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
  },
  flatListContent: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  storyCircle: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ff69b4',
  },
  userName: {
    fontSize: 12,
    marginTop: 5,
    color: '#333',
  },
  customHeader: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    alignItems: 'center',
  },
  customHeaderText: {
    color: 'white',
    fontWeight: 'bold',
  },
  customFooter: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    alignItems: 'center',
  },
  customFooterText: {
    color: 'white',
    fontSize: 12,
  }
});

export default StoriesListScreen;