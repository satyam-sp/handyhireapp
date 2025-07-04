import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity, // Used for the custom button
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Video } from 'react-native-compressor';
import RNFS from 'react-native-fs';
import { isValidFile, trim } from 'react-native-video-trim';

// Icon library
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Example: using MaterialCommunityIcons
// Progress bar library
import * as Progress from 'react-native-progress'; // Importing react-native-progress

const MAX_DURATION_SECONDS = 60;

const VideoProcessingAndUpload: React.FC = () => {
  const [selectedVideoUri, setSelectedVideoUri] = useState<string | null>(null);
  const [processedVideoUri, setProcessedVideoUri] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0); // For compression/upload progress (0-1)
  const [uploadComplete, setUploadComplete] = useState(false); // To track upload completion

  const selectVideo = async () => {
    setUploadComplete(false); // Reset upload status
    const result = await launchImageLibrary({
      mediaType: 'video',
      quality: 1,
      includeExtra: true,
    });

    if (result.didCancel) {
      console.log('User cancelled video picker');
    } else if (result.errorCode) {
      console.log('ImagePicker Error: ', result.errorCode, result.errorMessage);
    } else if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      const duration = result.assets[0].duration;
      if (uri) {
        setSelectedVideoUri(uri);
        setProcessedVideoUri(null);

        console.log('Selected video URI:', uri);
        console.log('Selected video duration:', duration);

        if (duration && duration > MAX_DURATION_SECONDS) {
          Alert.alert(
            'Video Too Long',
            `The selected video is longer than ${MAX_DURATION_SECONDS} seconds. It will be trimmed and compressed.`
          );
          await processVideo(uri); // Trim and then compress
        } else {
          Alert.alert('Compressing Video', 'Video is within duration. Starting compression...');
          await compressUri(uri); // Directly compress
        }
      }
    }
  };

  const compressUri = async (fileUri: string) => {
    setProcessing(true); // Indicate processing (compression)
    try {
      console.log('DEBUG: URI passed to compressUri:', fileUri);
      if (!fileUri) {
        throw new Error("File URI for compression is null or undefined.");
      }

      const compressedUri = await Video.compress(
        fileUri,
        {
          compressionMethod: 'auto',
          quality: 'low',
        },
        (progressValue) => {
          setProgress(progressValue); // Progress is 0-1
          console.log(`Compression Progress: ${Math.round(progressValue * 100)}%`);
        }
      );

      console.log('Compressed video URI:', compressedUri);
      setProcessedVideoUri(compressedUri);
      const fileSizeMB = ((await RNFS.stat(compressedUri)).size / (1024 * 1024)).toFixed(2);
      Alert.alert('Success', `Video processed! Size: ${fileSizeMB} MB`);

      // Auto-upload after successful compression
      if (compressedUri) {
        await uploadVideo(compressedUri);
      }

    } catch (error) {
      console.error('Video compression failed:', error);
      Alert.alert('Error', `Failed to compress video: ${error.message || 'Unknown error'}`);
    } finally {
      setProcessing(false);
      setProgress(0); // Reset progress after compression
    }
  };

  const processVideo = async (uri: string) => {
    if (!uri) {
      Alert.alert('Error', 'No video selected to process.');
      return;
    }
    setProcessing(true);
    setProcessedVideoUri(null);

    try {
      console.log('DEBUG: Original URI for trimming:', uri);
      const videoIsValid = await isValidFile(uri);
      if (!videoIsValid) {
        Alert.alert('Error', 'Invalid video file selected or cannot be accessed.');
        setProcessing(false);
        return;
      }

      const startTime = 0;
      const endTime = MAX_DURATION_SECONDS;

      // Note: react-native-video-trim's `trim` returns an object, not just the URI directly.
      const trimResult = await trim(uri, {
        startTime: startTime * 1000,
        endTime: endTime * 1000,
      });
      const trimmedUri = trimResult; // Access the source property

      console.log('DEBUG: Trimmed video URI:', trimmedUri);

      if (!trimmedUri) {
        throw new Error("Trimming resulted in an empty URI.");
      }

      // Proceed to compress the trimmed video
      await compressUri(trimmedUri);

    } catch (error) {
      console.error('Video trimming failed:', error);
      Alert.alert('Error', `Failed to trim video: ${error.message || 'Unknown error'}`);
      setProcessing(false);
    } finally {
      // setProcessing(false) and setProgress(0) are now handled by compressUri's finally block
    }
  };

  const uploadVideo = async (uriToUpload: string) => {
    if (!uriToUpload) {
      Alert.alert('Error', 'No video to upload.');
      return;
    }

    setUploading(true);
    setProgress(0); // Reset progress for upload

    try {
      const fileInfo = await RNFS.stat(uriToUpload);
      const fileName = uriToUpload.split('/').pop();
      const fileType = 'video/mp4';

      const formData = new FormData();
      formData.append('video', {
        uri: uriToUpload,
        name: fileName,
        type: fileType,
      } as any);

      const uploadUrl = 'YOUR_UPLOAD_SERVER_ENDPOINT'; // IMPORTANT: Replace with your actual endpoint

      const xhr = new XMLHttpRequest();
      xhr.open('POST', uploadUrl);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = (event.loaded / event.total); // Value is 0-1
          setProgress(percent);
          console.log(`Upload Progress: ${Math.round(percent * 100)}%`);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          console.log('Upload successful:', xhr.responseText);
          Alert.alert('Success', 'Video uploaded successfully!');
          setUploadComplete(true); // Mark upload as complete
          // Optionally, delete the local processed file after successful upload
          // RNFS.unlink(uriToUpload);
        } else {
          console.error('Upload failed:', xhr.status, xhr.responseText);
          Alert.alert('Error', `Upload failed: ${xhr.status} ${xhr.statusText}`);
          setUploadComplete(false);
        }
        setUploading(false);
        setProgress(0);
      };

      xhr.onerror = (e) => {
        console.error('Upload network error:', e);
        Alert.alert('Error', 'Network error during upload.');
        setUploading(false);
        setProgress(0);
        setUploadComplete(false);
      };

      xhr.send(formData);

    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload video.');
      setUploading(false);
      setProgress(0);
      setUploadComplete(false);
    }
  };

  return (
    <>
      {(processing || uploading) ?
        <Progress.Circle
          size={80} // Size of the circle
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  roundButton: {
    width: 70,
    height: 70,
    borderRadius: 40, // Half of width/height to make it a perfect circle
    backgroundColor: '#007bff', // Blue background
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2, // Initial border
    borderColor: 'transparent', // Default transparent
  },
  disabledButton: {
    backgroundColor: '#cccccc', // Gray when disabled
  },
  completedBorder: {
    borderColor: '#FFD700', // Gold/Yellow color for completed border
    borderWidth: 4, // Make it more prominent
  },

  progressBar: {
    marginTop: 20,
    marginBottom: 10,
  },
 
});

export default VideoProcessingAndUpload;