import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { styles, Colors } from './styles' // Assuming styles and Colors are exported from a 'styles.ts' in the same directory
import { truncateText } from '../../utils/helper'; // Assuming helper.ts is in utils
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { getActiveJobs } from '../../slices/instantJob.slice';
import CardSkeleton from './CardSkeleton'; // Assuming this component exists and renders the skeleton
import UserProfileCarousel from '../../components/user-carousel';
import { navigate } from '../../utils/navigateRef';

const { width } = Dimensions.get('window');
const activeJobCardWidth = width * 0.9; // Same as in styles

const ActivejobCards: React.FC = () => {
  const dispatch = useDispatch();
  // Using activeJobsLoading as per your latest provided code
  const { activeJobs, activeJobsLoading, activeJobError } = useSelector((state: any) => state.instantjob);

  useEffect(() => {
    dispatch(getActiveJobs() as any)
  }, [])

	const handleCardPress = (job: any) => {
		navigate('InstantJobDetails', { job_id: job.id })
	}

  return (
    <>
      <Text style={styles.sectionHeading}>Your Active Job </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.professionalsContainer}>
        {/* Conditional rendering for loading state using CardSkeleton */}
        {activeJobsLoading ? (
          // CardSkeleton should internally handle rendering multiple skeleton cards if desired
          <CardSkeleton />
        ) : activeJobError ? (
          // Handle error state
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load active jobs.</Text>
            <TouchableOpacity onPress={() => dispatch(getActiveJobs() as any)}>
              <Text style={styles.retryButtonText}>Tap to Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Render actual active jobs when not loading and no error
          activeJobs?.map((job: any) => {
            const activeJob = job.attributes;

            return (
              <LinearGradient
                key={activeJob.id} // Use activeJob.id for key
                colors={[Colors.cardBackground, Colors.cardBackgroundGray]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.activeJobCard}
              >
                
                <View style={styles.activeJobHeader}>
                  <FontAwesome name="briefcase" size={24} color={Colors.accentBlue} style={styles.activeJobIcon} />
                  <Text
                    numberOfLines={2}
                    style={styles.activeJobTitle}
                  >
                    {/* Width for truncation needs to consider activeJobCard's padding etc. */}
                    {truncateText(activeJob.title, 2, { fontSize: 20, lineHeight: 24, width: activeJobCardWidth - (20 * 2) - 24 - 10 })}
                  </Text>
                </View>
                <Text
                  style={styles.activeJobDescription}
                  numberOfLines={4}
                >
                  {/* Width for truncation needs to consider activeJobCard's padding etc. */}
                  {truncateText(activeJob.description, 4, { fontSize: 14, lineHeight: 20, width: activeJobCardWidth - (20 * 2) })}
                </Text>
								<View style={{flex: 1, flexDirection: 'row', padding: 10}}>
                <TouchableOpacity style={styles.activeJobButton} onPress={() => handleCardPress(activeJob)}>
                  <Text style={styles.activeJobButtonText}>View Details</Text>
                  <FontAwesome name="chevron-right" size={14} color={'white'} style={{ marginLeft: 5 }} />
                </TouchableOpacity>
								<UserProfileCarousel />
								</View>
              </LinearGradient>
            );
          })
        )}
      </ScrollView>
    </>
  );
};

export default ActivejobCards;