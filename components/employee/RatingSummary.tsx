// components/employee/RatingSummarySection.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * Component to display key performance metrics like Rating, Total Jobs, and Reviews Count.
 * @param {object} props - The component props.
 * @param {number} props.rating - The employee's rating.
 * @param {number} props.totalJobs - The total number of jobs completed.
 * @param {number} props.reviewsCount - The number of reviews received.
 */
const RatingSummarySection = ({ rating, totalJobs, reviewsCount }: any) => {
  const renderMetric = (iconName: any, label: string, value: string, isRating = false) => (
    <View style={styles.metricItem}>
      <Icon name={iconName} size={30} color={isRating ? '#FFD700' : '#007bff'} style={styles.metricIcon} />
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.ratingSection}>
      {renderMetric("star-circle", "Rating", rating?.toFixed(1) || 'N/A', true)}
      <View style={styles.divider} />
      {renderMetric("briefcase", "Total Jobs", totalJobs || 0)}
      <View style={styles.divider} />
      {renderMetric("comment-multiple", "Reviews", reviewsCount || 0)}
    </View>
  );
};

const styles = StyleSheet.create({
  ratingSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1, // Ensures even distribution
  },
  metricIcon: {
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  divider: {
    height: '60%', // Adjust height as needed
    width: 1,
    backgroundColor: '#e0e0e0',
  },
});

export default RatingSummarySection;
