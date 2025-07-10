import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal, KeyboardAvoidingView, Platform, TextInput, Linking, Alert, ScrollView, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import StaticMapWithRoute from '../../../components/maps/StaticRoute';
import { useDispatch, useSelector } from 'react-redux';
import { getInstantJobApply, getInstantJobById, getInstantJobCancel } from '../../../slices/instantjobs.slice';
import AppLoader from '../../../components/loader/FullLoader';
import ImageGridWithViewer from '../../../components/image-grid/ImageGridWithViewer';
import { useThrottleCallback } from '../../../components/hooks/useThrottleCallback';
import SoftButton from '../../../components/Button/SoftButton';
import TickMark from '../../../assets/tick-mark.png'
import TimeSlotSelector from '../../../components/TimeSlotSelector';
const screenHeight = Dimensions.get('window').height;
const DEFAULT_TIME_SLOT = "10:00 AM - 12:00 PM"
export default function JobDetailScreen({ route }: any) {
    const { job_id } = route.params;
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [showApplyModal, setShowApplyModal] = useState(false);
    const { currentInstantJob: job, isLoading, applyJobLoading } = useSelector((state: any) => state.instantjobs);
    const employee = useSelector((state: any) => state.register.employee);
    const [priceInput, setPriceInput] = useState('');
    const [timeInput, setTimeSlot] = useState(DEFAULT_TIME_SLOT);
    const geocoords = useSelector((state: any) => state.instantjobs.geocoords);

    useEffect(() => {
        dispatch(getInstantJobById(job_id) as any);
    }, [job_id]);

    useEffect(() => {
        if (job && job.price) {
            setPriceInput(job.price.toString()); // Ensure it's a string for TextInput
        }
    }, [job]);

    const handleApply = () => {
        setShowApplyModal(true);
    };

    const confirmApply = () => {
        // Use the priceInput value here
        dispatch(getInstantJobApply({
            id: job_id,
            status: 1,
            employee_id: employee.id,
            final_price: parseFloat(priceInput)
        }) as any);
        setShowApplyModal(false);
    };

    const handleCancel = () => {
        dispatch(getInstantJobCancel({ id: job_id, employee_id: employee.id }) as any);
    };

    const throttledApply = useThrottleCallback(confirmApply, 1000);
    const throttledCancel = useThrottleCallback(handleCancel, 1000);

    const handleViewOnMap = async () => {
        if (!job || !job.latitude || !job.longitude) {
            Alert.alert('Location Missing', 'Job location data is not available.');
            return;
        }

        const destinationLat = job.latitude;
        const destinationLon = job.longitude;
        const currentLat = geocoords.lat;
        const currentLon = geocoords.lon;

        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${currentLat},${currentLon}&destination=${destinationLat},${destinationLon}&travelmode=driving`;

        try {
            const canOpen = await Linking.canOpenURL(googleMapsUrl);

            if (canOpen) {
                await Linking.openURL(googleMapsUrl);
            } else {
                const storeUrl = Platform.select({
                    ios: 'https://apps.apple.com/us/app/google-maps/id585027354',
                    android: 'market://details?id=com.google.android.apps.maps',
                    default: 'https://play.google.com/store/apps/details?id=com.google.android.apps.maps',
                });

                Alert.alert(
                    'Google Maps not found',
                    'Please install Google Maps to view the route.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Install', onPress: () => Linking.openURL(storeUrl!) },
                    ]
                );
            }
        } catch (error) {
            console.error('An error occurred', error);
            Alert.alert('Error', 'Could not open map. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <AppLoader /> // Using a dedicated AppLoader component for full-screen loader
        );
    }

    if (!job) {
        return (
            <View style={styles.centeredMessageContainer}>
                <Text style={styles.errorMessage}>Job not found or an error occurred.</Text>
            </View>
        );
    }

    return (
        <View style={styles.fullScreenContainer}> {/* New container to ensure flex:1 works for ScrollView */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={26} color="#333" />
            </TouchableOpacity>

            <ScrollView style={styles.scrollViewContent} contentContainerStyle={styles.scrollContentPadding}>
                <View style={styles.mainContent}> {/* Wrap main content for better padding control */}
                    <Text style={styles.title}>{job.title}</Text>
                    <Text style={styles.category}>{job.job_category?.name}</Text>
                    <Text style={styles.description}>{job.description}</Text>
                    <Text style={styles.price}>Price: ₹{job.price}/{job.rate_type_humanize}</Text>
                    <Text style={styles.date}>Posted on: {job.created_at}</Text>
                  

                    <View style={styles.creatorBox}>
                        <Text style={styles.creatorName}>Created by: {job.user?.full_name}</Text>
                        <Text style={styles.paidVerifiedText}>
                            Paid: Verified {true && (
                                <Image source={TickMark} style={styles.tickMarkImageInline} /> // Adjust path to your tick mark image
                            )}
                        </Text>
                    </View>
                    {job.application_status === 'applied' && <View style={styles.creatorBox}>
                        <Text style={styles.finalPriceText}>You have been set price for this job price  ₹{job.final_price}/{job.rate_type_humanize} </Text>
                    </View>}

                    {job.images && job.images.length > 0 && (
                        <View style={styles.sectionCard}>
                            <ImageGridWithViewer images={job.images} />
                        </View>
                    )}

                    {job.latitude && job.longitude && (
                        <View style={styles.sectionCard}>
                            <View style={styles.mapContainer}>
                                {/* It's crucial that StaticMapWithRoute has style={{flex: 1}} or
                                    takes full height/width of its parent internally to display */}
                                <StaticMapWithRoute />
                                <TouchableOpacity style={styles.viewMapButton} onPress={handleViewOnMap}>
                                    <Text style={styles.viewMapButtonText}>View on Map</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    <TimeSlotSelector date={job.slot_date} bestTime={job.slot_time} setTimeSlot={setTimeSlot} time={timeInput}  />
                </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
                <SoftButton
                    title={job.application_status === 'applied' ? 'Cancel Application' : 'Apply for Job'}
                    onPress={job.application_status === 'applied' ? throttledCancel : handleApply}
                    color={job.application_status === 'applied' ? 'red' : 'blue'}
                    disabled={applyJobLoading}
                    loading={applyJobLoading}
                />
            </View>

            {/* Apply Confirmation Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showApplyModal}
                onRequestClose={() => setShowApplyModal(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalOverlay}
                >
                    <TouchableOpacity
                        style={styles.modalOverlayTouchable}
                        activeOpacity={1}
                        onPressOut={() => setShowApplyModal(false)}
                    >
                        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                            <Text style={styles.modalTitle}>Confirm Application</Text>
                            <Text style={styles.modalPrice}>Current Job Price: ₹{job.price}/{job.rate_type_humanize}</Text>

                            <Text style={styles.inputLabel}>Your Proposed Price (₹):</Text>
                            <TextInput
                                style={styles.priceInputField}
                                keyboardType="numeric"
                                value={priceInput}
                                onChangeText={setPriceInput}
                                placeholder="Enter your price"
                                placeholderTextColor="#a0a0a0"
                            />
                            <View style={styles.infoTextContainer}>
                                <Ionicons name="information-circle" size={18} color="#888" style={styles.infoIcon} />
                                <Text style={styles.infoTextContent}>
                                    This price might change based on the work complexity.
                                </Text>
                            </View>

                            <View style={styles.modalButtonRow}>
                                <SoftButton
                                    title="Cancel"
                                    onPress={() => setShowApplyModal(false)}
                                    color="grey"
                                    style={styles.modalButton}
                                />
                                <SoftButton
                                    title="Confirm Apply"
                                    onPress={throttledApply} // Use throttled version here too for modal confirm
                                    color="green"
                                    disabled={applyJobLoading || !priceInput.trim() || isNaN(parseFloat(priceInput))}
                                    loading={applyJobLoading}
                                    style={styles.modalButton}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    fullScreenContainer: {
        flex: 1,
        backgroundColor: '#f8f8f8', // Ensure the background fills the whole screen
    },
    scrollViewContent: {
        flex: 1, // Allow ScrollView to take available space
    },
    scrollContentPadding: {
        paddingTop: 50, // Space for the back button at the top
        paddingBottom: 20, // Padding at the bottom before the fixed button container
    },
    mainContent: {
        paddingHorizontal: 16, // Apply horizontal padding to main content
    },
    centeredMessageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    errorMessage: {
        fontSize: 16,
        color: '#666',
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 40 : 20, // Adjust for iOS status bar
        left: 10,
        zIndex: 10, // Ensure back button is on top
        padding: 5,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#2c3e50',
    },
    category: {
        backgroundColor: '#e0f7fa', // Light cyan
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 25,
        color: '#00796b', // Darker cyan
        marginVertical: 8,
        fontSize: 14,
        alignSelf: 'flex-start',
        fontWeight: '600',
    },
    description: {
        fontSize: 16,
        color: '#555',
        marginVertical: 10,
        lineHeight: 24,
    },
    price: {
        fontSize: 18,
        color: '#333',
        fontWeight: '700',
        marginVertical: 5,
    },
    finalPriceText: {
        color: 'green'
    },
    date: {
        fontSize: 13,
        color: '#777',
        fontWeight: '500',
        marginBottom: 20, // Add space before next section
    },
    creatorBox: {
        marginTop: 20,
        padding: 18,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: 20,
    },
    creatorName: {
        fontSize: 17,
        fontWeight: '600',
        color: '#333',
    },

    // --- NEW STYLES FOR INLINE TICK MARK ALIGNMENT ---
    paidVerifiedText: {
        fontSize: 15, // Match or slightly larger than surrounding text
        color: '#444',
        marginTop: 6, // Maintain spacing from above
        // backgroundColor: 'lightblue', // For debugging
    },
    tickMarkImageInline: {
        width: 16, // Adjust size as needed for your image
        height: 16, // Adjust size as needed for your image
        resizeMode: 'contain', // Important for image scaling
        // These are the crucial values you'll need to TWEAK:
        // They shift the image up/down relative to the text baseline.
        marginTop: 3,   // Pushes the image down from its natural baseline
        // marginBottom: -3, // Alternatively, pull it up from the bottom
        // backgroundColor: 'pink', // For debugging exact positioning
    },
    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 18,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    tickMark: {
        width: 20,
        marginTop: 10,
        height: 20
    },
    mapContainer: {
        height: 200, // Explicit height for map area
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#eee',
        position: 'relative',
        justifyContent: 'center', // Center map content
        alignItems: 'center', // Center map content
        backgroundColor: '#e0e0e0', // Placeholder background
    },
    mapComponent: {
        // This style is passed to StaticMapWithRoute, but StaticMapWithRoute
        // itself MUST have flex: 1 or similar to fill its parent (mapContainer)
        // for it to render correctly.
        ...StyleSheet.absoluteFillObject, // Ensures StaticMapWithRoute fills the entire container
    },
    viewMapButton: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 30,
        zIndex: 1, // Ensure the button is on top of the map
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    viewMapButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    buttonContainer: {
        paddingVertical: 15,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 3,
    },
    // Modal Styles (minor adjustments for consistency)
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalOverlayTouchable: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 25,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? 40 : 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    modalPrice: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 10,
        color: '#555',
    },
    inputLabel: {
        fontSize: 16,
        color: '#333',
        marginTop: 15,
        marginBottom: 8,
        fontWeight: '500',
    },
    priceInputField: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        width: '90%',
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 15,
        color: '#333',
        backgroundColor: '#f9f9f9',
    },
    infoTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 10,
        width: '90%',
    },
    infoIcon: {
        marginRight: 8,
    },
    infoTextContent: {
        fontSize: 13,
        color: '#888',
        fontStyle: 'italic',
        flexShrink: 1,
    },
    modalButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginTop: 10,
    },
    modalButton: {
        flex: 1,
        marginHorizontal: 5,
    },

    paidVerifiedTextInline: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        // In React Native, text components don't support flexDirection directly for their immediate children.
        // The inline image is treated like a character.
        // Vertical alignment within Text is harder to control precisely.
    },
    // This style is for the Image component nested directly in Text
    tickMarkImageInline: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
        position: 'relative',
        // Vertical alignment within Text can be challenging.
        // You often have to rely on trial-and-error with marginTop/marginBottom for exact visual centering.
        marginTop: 5, // Example adjustment, might need tuning for your specific font and image size
        // backgroundColor: 'pink', // Use for debugging alignment
    },
});
