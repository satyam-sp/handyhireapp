import React from 'react';
import { StyleSheet, ScrollView,  } from 'react-native';



const UserScreen = () => {

  // Fetch employee data
 

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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

export default UserScreen;
