import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getInstantJobById } from '../../slices/instantjobs.slice';
import AppLoader from '../../components/loader/FullLoader';
import ImageGridWithViewer from '../../components/image-grid/ImageGridWithViewer';
import UserRequestList from './UserRequestList';
import { Colors } from '../users/styles';
import dayjs from 'dayjs';
import IconEncrypto from 'react-native-vector-icons/Entypo';
import TimeDifferenceDisplay from '../../components/time-difference';
import SoftButton from '../../components/Button/SoftButton';
import { useThrottleCallback } from '../../components/hooks/useThrottleCallback';
import { revokeApplication } from '../../slices/instantJobApplication.slice';

const { width: screenWidth } = Dimensions.get('window');

export default function InstantJobScreen({ route }: any) {
    const { job_id } = route.params;
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const { currentInstantJob: job, isLoading } = useSelector((state: any) => state.instantjobs);
    const { revokeLoading, appliedApplications } = useSelector((state: any) => state.instantJobApplications);

    useEffect(() => {
        dispatch(getInstantJobById(job_id) as any);
    }, [job_id]);

    const isAnyAccepted = useMemo(() => {
        return appliedApplications.some((app: any) => app.attributes.status === 'accepted');
    },[appliedApplications])


    const handleRevokeAll  = () => {
        dispatch(revokeApplication({id: job.id} as any) as any)
    }
    const throttledRevoke = useThrottleCallback(handleRevokeAll, 1000);



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
                    <Text style={styles.title}>{job.title} #{job.jid}</Text>
                    <Text style={styles.category}>{job.job_category?.name}</Text>
                    <Text style={styles.description}>{job.description}</Text>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={styles.price}>Price: ₹{job.price}/{job.rate_type_humanize}</Text>
                        <Text style={styles.slot}> <IconEncrypto name='time-slot' /> {dayjs(job.slot_date).format('DD MMM YY') + '\n' + job.slot_time}
                        </Text>
                    </View>
                    <Text style={styles.date}>Posted on: {dayjs(job.created_at).fromNow()}</Text>



                    {job.images && job.images.length > 0 && (
                        <View style={styles.sectionCard}>
                            <ImageGridWithViewer images={job.images} />
                        </View>
                    )}

                </View>
                <UserRequestList job={job} />

                <View style={styles.buttonContainer}>
                <TimeDifferenceDisplay slotDate={job.slot_date} slotTime={job.slot_time} />

                {isAnyAccepted && <SoftButton
                    title={'Revoke'}
                    onPress={throttledRevoke}
                    color={'orange'}
                    disabled={revokeLoading}
                    loading={revokeLoading}
                />}

                </View>
            </ScrollView>

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
        fontSize: 15,
        color: '#333',
        fontWeight: '700',
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
    slot: {
        fontSize: 12,
        width: screenWidth / 2,
        fontWeight: 'bold',
        textAlign: 'right',
        color: Colors.accentBlue,

    }

});
