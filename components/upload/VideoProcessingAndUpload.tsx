
import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Progress from 'react-native-progress';

// Redux imports
import { useSelector, useDispatch } from 'react-redux';
import {
  setSelectedVideoUri,
  processAndCompressVideo,
  uploadVideo,
  resetState,
} from '../../slices/videoUpload.slice'; // Adjust path as needed

const MAX_DURATION_SECONDS = 60; // Max duration for the trimmed video

const VideoProcessingAndUpload: React.FC = () => {
  const dispatch = useDispatch<any>();
  const {
    selectedVideoUri,
    processedVideoUri,
    processing,
    uploading,
    progress,
    uploadComplete,
    error,
  } = useSelector((state: any) => state.videoUpload);

  const selectVideo = async () => {

    const result = await launchImageLibrary({
      mediaType: 'video',
      quality: 1,
      includeExtra: true,
    });

    if (result.didCancel) {
      console.log('User cancelled video picker');
    } else if (result.errorCode) {
      console.log('ImagePicker Error: ', result.errorCode, result.errorMessage);
      Alert.alert('Picker Error', result.errorMessage || 'An error occurred during video selection.');
    } else if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      const duration = result.assets[0].duration; // Duration in seconds

      if (uri) {
        dispatch(setSelectedVideoUri(uri));
        console.log('Selected video URI:', uri);
        console.log('Selected video duration:', duration);

        // Dispatch the async thunk for processing and compression
        const processResult = await dispatch(processAndCompressVideo({ uri, duration }));

        // If processing and compression was successful, trigger upload
        if (processAndCompressVideo.fulfilled.match(processResult)) {
          const finalUriToUpload = processResult.payload;
          if (finalUriToUpload) {
            await dispatch(uploadVideo(finalUriToUpload));
          } else {
            Alert.alert('Error', 'Processed video URI is missing for upload.');
          }
        }
      }
    }
  };

  return (
    <>
    {(processing || uploading) ?
      <Progress.Circle
        size={68} // Size of the circle
        progress={progress} // 0 to 1
        showsText={true}
        formatText={(progress) => `${Math.round(progress * 100)}%`}
        color={uploading ? '#4CAF50' : '#2196F3'} // Green for uploading, blue for processing
        borderColor="#ddd"
        borderWidth={2}
        thickness={5}
        style={styles.progressBar}
      ><Icon name="plus" size={30} color="#fff" /></Progress.Circle> : <TouchableOpacity
        style={[
          styles.roundButton,
          (processing || uploading) && styles.disabledButton, // Disable styling
          uploadComplete && styles.completedBorder, // Yellow border on completion
        ]}
        onPress={selectVideo}
        disabled={processing || uploading}
      >

        <Icon name="plus" size={30} color="#fff" />

      </TouchableOpacity>
    }
  </>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    marginTop: 0,
  },
  disabledButton: {
    backgroundColor: '#ddd',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5', // Changed from f5fcff for consistency
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  roundButton: {
    width: 68, // Increased size slightly
    height: 68,
    borderRadius: 40,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  // disabledButton style is now handled by the `disabled` prop on TouchableOpacity and the conditional rendering
  completedBorder: {
    borderColor: '#FFD700',
    borderWidth: 4,
  },
  progressBarCircle: {
    marginBottom: 20,
    // The Progress.Circle component will render the plus icon inside it
    // so we don't need a separate container for the icon here.
  },
  infoText: {
    marginTop: 15,
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  successText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  errorTextDisplay: {
    marginTop: 20,
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  instructions: {
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default VideoProcessingAndUpload;