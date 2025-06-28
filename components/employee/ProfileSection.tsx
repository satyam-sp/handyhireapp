// components/employee/ProfileSection.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * Reusable section component for employee profile details.
 * Includes a title and an edit/save button.
 * @param {object} props - The component props.
 * @param {string} props.title - The title of the section.
 * @param {boolean} props.editing - Whether the section is in editing mode.
 * @param {function} props.onEdit - Callback function when the edit/save button is pressed.
 * @param {React.Node} props.children - The content to be rendered inside the section.
 */
const ProfileSection = ({ title, editing, onEdit, children }: any) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={onEdit} style={styles.editButton}>
          <Icon name={editing ? "content-save-outline" : "pencil-outline"} size={20} color="#007bff" />
          <Text style={styles.editText}>{editing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#eaf4ff', // Light blue background for edit button
  },
  editText: {
    color: '#007bff',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 14,
  },
  sectionContent: {},
});

export default ProfileSection;
