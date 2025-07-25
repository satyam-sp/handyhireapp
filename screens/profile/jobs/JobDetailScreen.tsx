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
        if (job && job.application?.slot_time) {
            setTimeSlot(job.application?.slot_time); // Ensure it's a string for TextInput
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
            final_price: parseFloat(priceInput),
            slot_time: timeInput
        }) as any);
        setShowApplyModal(false);
    };

    const handleCancel = () => {
        dispatch(getInstantJobCancel({ id: job.application.id, jobId: job.id }) as any);
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
            <AppLoader />
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
        <View style={styles.fullScreenContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={26} color="#333" />
            </TouchableOpacity>

            <ScrollView style={styles.scrollViewContent} contentContainerStyle={styles.scrollContentPadding}>
                <View style={styles.mainContent}>
                    <Text style={styles.title}>{job.title} <Text style={styles.jid}>#{job.jid}</Text></Text>
                    <Text style={styles.category}>{job.job_category?.name}</Text>
                    <Text style={styles.description}>{job.description}</Text>
                    <Text style={styles.price}>Price: ₹{job.price}/{job.rate_type_humanize}</Text>
                    <Text style={styles.date}>Posted on: {job.created_at}</Text>
                  

                    <View style={styles.creatorBox}>
                        <Text style={styles.creatorName}>Created by: {job.user?.full_name}</Text>
                        <Text style={styles.paidVerifiedText}>
                            Paid: Verified {true && (
                                <Image source={TickMark} style={styles.tickMarkImageInline} />
                            )}
                        </Text>
                    </View>
                    {['applied','accepted'].includes(job?.application?.status) && <View style={styles.creatorBox}>
                        <Text style={styles.finalPriceText}>You have been set price for this job price {'\n'} ₹{job.application?.final_price}/{job.rate_type_humanize} </Text>
                    </View>}

                    {job.images && job.images.length > 0 && (
                        <View style={styles.sectionCard}>
                            <ImageGridWithViewer images={job.images} />
                        </View>
                    )}

                    {job.latitude && job.longitude && (
                        <View style={styles.sectionCard}>
                            <View style={styles.mapContainer}>
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
                    title={['applied','accepted'].includes(job?.application?.status) ? 'Cancel Application' : 'Apply for Job'}
                    onPress={['applied','accepted'].includes(job?.application?.status) ? throttledCancel : handleApply}
                    color={['applied','accepted'].includes(job?.application?.status) ? 'red' : 'blue'}
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
                                    onPress={throttledApply}
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
        backgroundColor: '#f8f8f8',
    },
    scrollViewContent: {
        flex: 1,
    },
    scrollContentPadding: {
        paddingTop: 50,
        paddingBottom: 20,
    },
    mainContent: {
        paddingHorizontal: 16,
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
        top: Platform.OS === 'ios' ? 40 : 20,
        left: 10,
        zIndex: 10,
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
        backgroundColor: '#e0f7fa',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 25,
        color: '#00796b',
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
        marginBottom: 20,
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
    paidVerifiedText: {
        fontSize: 15,
        color: '#444',
        marginTop: 6,
    },
    tickMarkImageInline: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
        marginTop: 3,
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
    mapContainer: {
        height: 200,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#eee',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
    },
    viewMapButton: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 30,
        zIndex: 1,
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
    jid: {
        fontSize: 15,
        backgroundColor: '#e0f7fa',
        
    }
});