// VideoPlayerScreen.tsx
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  StatusBar,
  Platform,
} from 'react-native';
import Video from 'react-native-video';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress'; // Import Progress library

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const VideoPlayerScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const videoRef = useRef<Video>(null);

  const { userStories } = route.params as any;
  // Assuming you want to play the FIRST video from the userStories array for simplicity.
  // If you want to cycle through multiple videos for a single user,
  // you'll need more complex state management (e.g., currentVideoIndex).
  const videoUrl = userStories?.stories.find((story: any) => story.type === 'video')?.story_video;
  const videoTitle = userStories?.username || 'Video'; // Use username as title, or default

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoAspectRatio, setVideoAspectRatio] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0); // Current playback time
  const [videoDuration, setVideoDuration] = useState(0); // Total video duration

  // Function to determine dynamic resizeMode
  const getDynamicResizeMode = (videoAR: number) => {
    const screenAR = screenWidth / screenHeight;

    if (videoAR > screenAR) {
      return 'contain';
    } else {
      return 'cover';
    }
  };

  const onVideoLoadStart = () => {
    setIsLoading(true);
    setError(null);
    setVideoAspectRatio(null);
    setCurrentTime(0); // Reset time
    setVideoDuration(0); // Reset duration
  };

  const onVideoLoad = (data: any) => {
    setIsLoading(false);
    if (data.naturalSize && data.naturalSize.width && data.naturalSize.height) {
      const ar = data.naturalSize.width / data.naturalSize.height;
      setVideoAspectRatio(ar);
      console.log('Video loaded. Natural size:', data.naturalSize);
      console.log('Calculated Aspect Ratio:', ar);
      console.log(`Screen Size: ${screenWidth}x${screenHeight}, AR: ${screenWidth / screenHeight}`);
      console.log(`Calculated resizeMode: ${getDynamicResizeMode(ar)}`);
    } else {
      console.warn('Could not get natural size of video, defaulting to screen AR:', data);
      setVideoAspectRatio(screenWidth / screenHeight);
    }
    setVideoDuration(data.duration); // Set total video duration
  };

  const onVideoProgress = (data: any) => {
    // This callback fires frequently with playback progress
    setCurrentTime(data.currentTime);
  };

  const onVideoEnd = () => {
    // Video has finished playing
    // You could navigate back, or play next video in a sequence
    navigation.goBack();
  };

  const onVideoError = (err: any) => {
    console.error('Video Playback Error:', err);
    setIsLoading(false);
    setError('Failed to load video. Please try again.');
    if (Platform.OS === 'ios' && err.error && err.error.localizedDescription) {
      setError(`Failed to load video: ${err.error.localizedDescription}`);
    } else if (Platform.OS === 'android' && err.error && err.error.extra) {
      setError(`Failed to load video (code: ${err.error.extra}).`);
    }
  };

  const currentResizeMode = videoAspectRatio ? getDynamicResizeMode(videoAspectRatio) : 'contain';

  // Handle case where no video URL is found in userStories
  if (!videoUrl) {
    return (
      <View style={[styles.container, { backgroundColor: 'white' }]}>
        <Text style={{ color: 'black', fontSize: 18 }}>No video found for this story.</Text>
        <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
            <Text style={styles.goBackButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      {/* Header Overlay with Progress Bar */}
      <View style={styles.headerOverlay}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.videoTitleText}>{videoTitle}</Text>
        {/* Progress Bar */}
        {videoDuration > 0 && ( // Only show if duration is known
          <Progress.Bar
            progress={currentTime / videoDuration} // Calculate progress (0 to 1)
            width={screenWidth} // Adjust width to fit within padding
            height={4}
            color="#f8e71c" // Green color for progress
            unfilledColor="rgba(255,255,255,0.3)" // Lighter background
            borderColor="transparent" // No border
            style={styles.progressBar}
          />
        )}
      </View>

      {/* Video Player */}
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={styles.videoPlayer}
        controls={false} // Keeping controls false for custom UI
        resizeMode={currentResizeMode}
        onLoadStart={onVideoLoadStart}
        onLoad={onVideoLoad}
        onProgress={onVideoProgress} // Listen for progress updates
        onEnd={onVideoEnd} // Listen for video end
        onError={onVideoError}
        paused={false}
        repeat={false} // Don't repeat if you want onEnd to fire
      />

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading video...</Text>
        </View>
      )}

      {/* Error Message */}
      {error && (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => { setError(null); setIsLoading(true); videoRef.current?.seek(0); }}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
            <Text style={styles.goBackButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // IMPORTANT: Changed height to fill available space, not hardcoded screenHeight - 100
  // If you intended to leave space for other elements, define it more explicitly,
  // or use flex properties within a parent container.
  videoPlayer: {
    width: screenWidth,
    height: screenHeight - 300, // Fill full screen. If you still want space for other elements, adjust parent layout.
    backgroundColor: 'black',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  goBackButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  goBackButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerOverlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 10, // Adjust for iOS notch and Android status bar
    left: 0,
    right: 0,
    zIndex: 1, // Ensure it's above the video
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Distribute items
    // You might want a semi-transparent background for readability
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButton: {
    padding: 5, // Add padding for easier tapping
  },
  videoTitleText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10, // Adjust spacing
    flex: 1, // Allow title to take available space
  },
  progressBar: {
    position: 'absolute',
    bottom: 0, // Position at the bottom of the headerOverlay
    left: 0,
    right: 0,
  },
});

export default VideoPlayerScreen;