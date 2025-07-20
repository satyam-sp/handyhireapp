// src/screens/InstantJobPostScreen/styles.ts
import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    keyboardAvoidingContainer: {
        flex: 1,
    },
    container: {
        padding: 20,
        paddingTop: Platform.OS === 'ios' ? 80 : 60, // Adjust for back button and potential notch
        flexGrow: 1,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100, // Ensure it's on top
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 40 : 20,
        left: 10,
        zIndex: 10,
        padding: 5,
    },
    mainHeading: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    // Stepper Styles
    stepperContainer: {
        marginBottom: 30,
        alignItems: 'center',
        width: '100%',
    },
    stepIndicatorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%', // Make it wider
        marginBottom: 8,
    },
    stepDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#bbb',
        borderWidth: 2,
        borderColor: '#ccc',
    },
    stepDotActive: {
        backgroundColor: '#075e54',
        borderColor: '#075e54',
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    stepLine: {
        flex: 1,
        height: 2,
        backgroundColor: '#bbb',
        marginHorizontal: 0,
    },
    stepTextRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%', // Aligns text with dots better
        paddingHorizontal: 10,
    },
    stepText: {
        fontSize: 14,
        color: '#888',
        fontWeight: '500',
        flex: 1, // Allow text to take space
        textAlign: 'center',
    },
    stepTextActive: {
        color: '#075e54',
        fontWeight: '700',
    },
    // Step Content Styles
    stepContent: {
        backgroundColor: '#ffffff', // White background for each step
        borderRadius: 15,
        padding: 20,
        paddingBottom: 30, // Extra padding at bottom
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    stepHeading: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        marginBottom: 8,
        marginTop: 15,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    gridItem: {
        width: '33.33%',
        padding: 8,
        alignItems: 'center',
    },
    grid1: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        paddingVertical: 10,
    },
    gridItem1: {
        width: '33.33%',
        padding: 8,
        alignItems: 'center',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
        marginBottom: 5,
    },
    imageUploadRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 10,
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0f7fa',
        borderWidth: 1,
        borderColor: '#075e54',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginRight: 10,
        marginTop: 5,
        minHeight: 50,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
    },
    uploadButtonText: {
        marginLeft: 8,
        color: '#075e54',
        fontWeight: '600',
    },
    imagePreviewContainer: {
        position: 'relative',
        width: 80,
        height: 80,
        marginRight: 10,
        marginTop: 5,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    removeImageButton: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 10,
        padding: 2,
    },
    categorySelectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginTop: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
        minHeight: 50,
    },
    categorySelectButtonText: {
        fontSize: 16,
        color: '#333',
    },
    datePickerContainer: {
        marginVertical: 10,
        paddingVertical: 5,
    },
    dateOption: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 90,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
    },
    dateOptionSelected: {
        backgroundColor: '#075e54',
        borderColor: '#075e54',
    },
    dateDay: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    dateYear: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    dateTextSelected: {
        color: '#fff',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        // Removed halfWidth because rateTypeContainer now spans full width
    },

    fullWidth: {
        width: '100%', // Keep for price if needed
    },
    // New styles for Rate Type selection
    rateTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 5,
        marginTop: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
        width: '100%', // Make it span full width in a rowContainer
    },
    rateOption: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 2,
    },
    rateOptionSelected: {
        backgroundColor: '#075e54',
    },
    rateOptionText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    rateOptionTextSelected: {
        color: '#fff',
    },
    // Navigation Buttons for Stepper
    nextButton: {
        flexDirection: 'row',
        backgroundColor: '#075e54',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '100%', // Full width
    },
    buttonDisabled: {
        backgroundColor: '#CCC',

    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        marginBottom: 20,
        width: '100%',
    },
    actionButton: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '48%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cancelButton: {
        backgroundColor: '#e0e0e0',
    },
    postButton: {
        
        backgroundColor: '#075e54',
        shadowRadius: 8.84,

    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    activityIndicator: {
        marginTop: 20,
        marginBottom: 10,
    },
});