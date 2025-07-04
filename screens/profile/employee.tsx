import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import useSWR from 'swr';
import { fetchSWR } from '../../utils/helper';
import { useDispatch } from 'react-redux';
import { setEmployee } from '../../slices/register.slice';
import { map } from 'lodash';

// Import new components
import ProfileSection from '../../components/employee/ProfileSection';
import ProfileInfoRow from '../../components/common/ProfileInfoRow';
import EmployeeProfileHeader from '../../components/employee/EmployeeProfileHeader';
import RatingSummarySection from '../../components/employee/RatingSummary';

// You might consider moving this image to a more global 'assets' folder
import coverImage from "../../assets/cities/indore.jpeg";
import VideoProcessingAndUpload from '../../components/upload/VideoProcessingAndUpload';
import StoriesListScreen from '../../components/story-carousel';

const ProfileScreen = () => {
  const dispatch = useDispatch();

  // Fetch employee data
  const { data: user, error, isLoading, mutate } = useSWR(
    '/api/v1/employees/get_employee',
    fetchSWR,
    {
      onSuccess: (data) => {
        dispatch(setEmployee(data)); // Update Redux state
      },
      onError: (err) => {
        console.error("Failed to fetch employee data:", err);
        Alert.alert("Error", "Could not load profile data.");
      }
    }
  );

  const [editing, setEditing] = useState<any>({});
  const [localUser, setLocalUser] = useState<any>(null); // Local state for editable fields

  // Initialize localUser when `user` data is loaded
  React.useEffect(() => {
    if (user) {
      setLocalUser(user);
    }
  }, [user]);

  // Handle toggling edit mode and saving changes
  const toggleEdit = useCallback(async (section:any) => {
    // If we're currently editing this section, attempt to save
    if (editing[section]) {
      // TODO: Implement actual API call to save updated data for 'localUser'
      // Example: await someUpdateEmployeeApi(localUser);
      Alert.alert("Save Functionality", `Saving changes for ${section} (Not actually implemented yet!)`);
      // After successful save, you might want to re-fetch or optimistically update SWR cache
      // mutate(localUser, false); // Optimistic update
      // mutate(); // Re-fetch
    }
    setEditing((prev: any) => ({ ...prev, [section]: !prev[section] }));
  }, [editing, localUser]); // Include localUser in dependencies for save logic

  // Update local state when input changes
  const updateField = useCallback((key: any, value: any) => {
    setLocalUser((prev: any) => ({ ...prev, [key]: value }));
  }, []);

  // Memoize job categories for performance
  const job_categories = useMemo(() => map(localUser?.job_categories, 'name'), [localUser]);

  if (isLoading || !localUser) { // Check for localUser as well, it might be null initially
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <EmployeeProfileHeader job_categories={job_categories} user={localUser} coverImage={coverImage} />

      <RatingSummarySection
        rating={localUser.rating}
        totalJobs={localUser.total_jobs_count} // Assuming 'total_jobs_count' exists on user object
        reviewsCount={localUser.reviews_count}
      />
      <VideoProcessingAndUpload />
      <StoriesListScreen />

      <ProfileSection title="Basic Information" editing={editing.basic} onEdit={() => toggleEdit('basic')}>
        <ProfileInfoRow label="Full Name" value={localUser.full_name} editing={editing.basic} onChange={(val: any) => updateField('full_name', val)} />
        <ProfileInfoRow label="Date of Birth" value={localUser.date_of_birth} editing={editing.basic} onChange={(val: any) => updateField('date_of_birth', val)} />
        <ProfileInfoRow label="Gender" value={localUser.gender} editing={editing.basic} onChange={(val: any) => updateField('gender', val)} />
        <ProfileInfoRow label="Mobile Number" value={localUser.mobile_number} editing={editing.basic} onChange={(val: any) => updateField('mobile_number', val)} keyboardType="phone-pad" />
        <ProfileInfoRow label="Aadhaar Number" value={localUser.aadhaar_number} editing={editing.basic} onChange={(val: any) => updateField('aadhaar_number', val)} keyboardType="numeric" />
        <ProfileInfoRow label="Aadhaar Verified" value={localUser.aadhaar_verified ? 'Yes' : 'No'} />
        <ProfileInfoRow label="PAN Number" value={localUser.pan_number} editing={editing.basic} onChange={(val: any) => updateField('pan_number', val)} />
        <ProfileInfoRow label="Address" value={localUser.address} editing={editing.basic} onChange={(val: any) => updateField('address', val)} />
        {/* Languages Spoken might need a more complex input (e.g., multiselect/tags) */}
        <ProfileInfoRow label="Languages Spoken" value={localUser.languages_spoken.join(', ')} editing={editing.basic} onChange={(val: any) => updateField('languages_spoken', val.split(', '))} />
      </ProfileSection>

      <ProfileSection title="Job Details" editing={editing.job} onEdit={() => toggleEdit('job')}>
        <ProfileInfoRow label="Experience (years)" value={`${localUser.experience_years}`} editing={editing.job} onChange={(val: any) => updateField('experience_years', parseInt(val))} keyboardType="numeric" />
        <ProfileInfoRow label="Work Location" value={localUser.work_location} editing={editing.job} onChange={(val: any) => updateField('work_location', val)} />
        <ProfileInfoRow label="Availability" value={localUser.availability} editing={editing.job} onChange={(val: any) => updateField('availability', val)} />
        <ProfileInfoRow label="Expected Pay" value={localUser.expected_pay} editing={editing.job} onChange={(val: any) => updateField('expected_pay', val)} keyboardType="numeric" />
        {/* Job Categories also likely needs a more complex input */}
        <ProfileInfoRow label="Job Categories" value={job_categories.join(', ')} editing={editing.job} onChange={(val: any) => updateField('job_categories', val.split(', '))} />
        <ProfileInfoRow label="Police Verified" value={localUser.police_verified ? 'Yes' : 'No'} />
        <ProfileInfoRow label="Verified" value={localUser.verified ? 'Yes' : 'No'} />
      </ProfileSection>


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default ProfileScreen;
