// src/components/UserRequestList.tsx
import React, { useEffect, useMemo, useState, useRef } from 'react'; // Import useRef
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native'; // Import TouchableOpacity
import UserRequestCard from './UserRequestCard';
import { useDispatch, useSelector } from 'react-redux';
import { getAppliedJobs, updateApplicationStatus } from '../../slices/instantJobApplication.slice';
import { RootState } from '../../store';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import InfoTooltip from '../../components/info-tooltip'; // Import the new tooltip component

const UserRequestList = ({ job }: any) => {

    const { loading, error, appliedApplications = [], loading1 } = useSelector((state: RootState) => state.instantJobApplications)
    const dispatch = useDispatch();
    const [activeCardId, setActiveCardId] = useState<string | null>(null);

    const flatListRef = React.useRef(null);

    // State for the tooltip
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipTargetCoords, setTooltipTargetCoords] = useState({ x: 0, y: 0 });
    const infoIconRef = useRef<any>(null); // Ref for the info icon container

    useEffect(() => {
        dispatch(getAppliedJobs(job.id) as any)
    }, [job.id])

    const handleAcceptRevoke = (applicationId: string, status: number) => {
        dispatch(updateApplicationStatus({ id: job.id, applicationId: applicationId, status: status } as any) as any)
    };

    const handleDecline = (userId: string) => {
        // Implement decline logic here
    };

    const handleViewProfile = (userId: string) => {
        Alert.alert(`View Profile`, `Navigating to profile of user ID: ${userId}`);
    };

    const handleToggleCard = (applicationId: string) => {
        setActiveCardId(prevId => (prevId === applicationId ? null : applicationId));
    };

    const handleInfoIconPress = () => {
        if (infoIconRef.current) {
            infoIconRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
                setTooltipTargetCoords({ x: x + width / 2, y: y }); // Pass center X and top Y of icon
                setShowTooltip(prev => !prev); // Toggle visibility
            });
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        const obj = item.attributes.employee
       
        const applicationId = item.id
        const isRecommended = applicationId == item.attributes.recommended

        return (
            <UserRequestCard
                user={obj}
                applicationId={applicationId}
                application={item.attributes}
                loading1={loading1}
                onAcceptRevoke={handleAcceptRevoke}
                onDecline={handleDecline}
                onViewProfile={handleViewProfile}
                isToggled={activeCardId === item.id}
                onToggleCard={handleToggleCard}
                isRecommended={isRecommended}
            />
        )
    }

    const result = useMemo(() => {
        return <>
            {appliedApplications.length === 0 ? (
                <Text style={styles.noRequestsText}>No pending requests at the moment.</Text>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={appliedApplications}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    scrollEnabled={false}
                    initialNumToRender={5}
                    maxToRenderPerBatch={5}
                    windowSize={10}
                />
            )}
        </>
    }, [appliedApplications, loading, loading1, activeCardId])

    return (
        <>
            <View style={styles.headerContainer}> {/* New View to contain title and icon */}
                <Text style={styles.listTitle}>Pending Requests</Text>
                <TouchableOpacity
                    ref={infoIconRef} // Assign ref to the touchable icon
                    onPress={handleInfoIconPress}
                    style={styles.infoIconWrapper}
                >
                    <Ionicons name="information-circle-outline" size={22} color="#666" />
                </TouchableOpacity>
            </View>

            {loading && <Text>Loading...</Text>}
            {result}

            <InfoTooltip
                isVisible={showTooltip}
                onClose={() => setShowTooltip(false)}
                targetX={tooltipTargetCoords.x}
                targetY={tooltipTargetCoords.y}
                offsetX={-5} // Adjust these offsets to fine-tune position relative to the icon
                offsetY={10}
                tooltipWidth={250}
            >
                <Text style={styles.tooltipTextContent}>
                    This list displays applications from employees for the job you posted.
                    You can <Text style={{color: 'green'}}>Accept</Text>, <Text style={{color: 'orange'}}>Revoke</Text>, or <Text style={{color: 'red'}}>Decline</Text> their requests here.
                    The "Recommended" badge highlights employees based on their price, availablity, and rating.

                </Text>
            </InfoTooltip>
        </>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        marginLeft: 15, // Apply left margin to the container
    },
    listTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 8, // Space between text and icon
    },
    infoIconWrapper: {
        padding: 1, // Make the touchable area larger
    },
    noRequestsText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 50,
    },
    tooltipTextContent: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
});

export default UserRequestList;