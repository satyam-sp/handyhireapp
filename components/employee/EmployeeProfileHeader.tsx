// components/employee/EmployeeProfileHeader.js
import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import ProfileImage from './ProfileImage'; // Assuming ProfileImage is in the same directory or adjust path

/**
 * Component for the header section of the employee profile.
 * Displays cover image, profile image, name, and job categories.
 * @param {object} props - The component props.
 * @param {object} props.user - The user object containing full_name.
 * @param {string[]} props.job_categories - Array of job category names.
 * @param {any} props.coverImage - The source for the cover background image.
 */
const EmployeeProfileHeader = ({ user, job_categories, coverImage }: any) => {
  return (
    <View style={styles.headerContainer}>
      {/* ImageBackground allows content to be rendered on top of an image */}
      <ImageBackground source={coverImage} style={styles.coverImageBackground} imageStyle={styles.coverImageStyle}>
        <View style={styles.coverOverlay} />
      </ImageBackground>

      <View style={styles.headerContent}>
        <ProfileImage />
        <Text style={styles.name}>{user.full_name}</Text>
        <Text style={styles.job}>{job_categories.join(', ')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'relative',
    height: 250, // Fixed height for the header
    marginBottom: 30,
    borderRadius: 15,
    overflow: 'hidden', // Ensures content doesn't spill out
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3.84,
    elevation: 5,
  },
  coverImageBackground: {
    flex: 1, // Takes full height of its parent (headerContainer)
    width: '100%',
    justifyContent: 'center', // Center content vertically within the background
    alignItems: 'center', // Center content horizontally within the background
  },
  coverImageStyle: {
    resizeMode: 'cover',
    opacity: 0.35, // Adjust opacity of the background image for better contrast
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)', // Dark overlay for better text readability
  },
  headerContent: {
    position: 'absolute', // Position content over the background image
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center', // Center vertically within the header content area
    paddingTop: 40, // Adjust this as needed to position the avatar nicely
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff', // White text for contrast on dark overlay
    marginTop: 15,
    textShadowColor: 'rgba(0,0,0,0.5)', // Subtle text shadow for readability
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  job: {
    fontSize: 16,
    color: 'yellow', // Lighter color for job title
    marginTop: 8,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default EmployeeProfileHeader;
