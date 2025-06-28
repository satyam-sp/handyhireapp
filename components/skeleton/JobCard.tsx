import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';


const JobsCardSkeleton = () => {
    return <View style={styles.mainView}>
        {[0,0,0,0].map((_, index) => <JobCardSkeleton key={index}/> )}
    </View>
}

const JobCardSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={8}>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.statusIcon} />
          <View style={styles.title} />
        </View>

        <View style={styles.row}>
          <View style={styles.badge} />
          <View style={styles.distance} />
        </View>

        <View style={styles.description} />

        <View style={styles.metaRow}>
          <View style={styles.customerName} />
          <View style={styles.timeAgo} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};
export { JobCardSkeleton };
export default JobsCardSkeleton;
const styles = StyleSheet.create({
    mainView: {
        paddingTop: 10,
        paddingStart: 10,
        paddingEnd: 10,
        backgroundColor: '#fff'
    },
    card: {
      marginVertical: 10,
      padding: 16,
      backgroundColor: '#FFFF',
      borderRadius: 8,
      borderWidth: 2,
      borderColor: '#ccc',
      boxShadow: '2px 2px 8px 2px #ccc'
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    statusIcon: {
      width: 20,
      height: 20,
      borderRadius: 10,
      marginRight: 8,
    },
    title: {
      width: '70%',
      height: 20,
    },
    badge: {
      width: 80,
      height: 20,
      borderRadius: 12,
      marginRight: 10,
    },
    distance: {
      width: 60,
      height: 20,
      borderRadius: 12,
    },
    description: {
      width: '100%',
      height: 60,
      borderRadius: 8,
      marginVertical: 8,
    },
    metaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    customerName: {
      width: 120,
      height: 20,
      borderRadius: 8,
    },
    timeAgo: {
      width: 60,
      height: 20,
      borderRadius: 8,
    },
  });
  