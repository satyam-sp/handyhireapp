// screens/NearbyDataScreen.tsx

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity, StyleSheet, Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { requestLocationPermission, getCurrentLocation } from '../../../services/locationService';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { getDistance, getStatusColor } from '../../../utils/helper';
import { useDispatch, useSelector } from 'react-redux';
import { getInstantJobs, setCoords } from '../../../slices/instantjobs.slice';
import { isEmpty } from 'lodash';
import { getStorageData } from '../../../utils/storage-helper';
import { useInstantJobCable } from '../../../components/hooks/useInstantJobCable';
import JobsCardSkeleton from '../../../components/skeleton/JobCard';

dayjs.extend(relativeTime);


const JobsScreen = () => {
    const navigation = useNavigation();
    const subscriptionRef = useRef<any>(null);

    const dispatch = useDispatch();
    const geocoords = useSelector((state: any) => state.instantjobs.geocoords);
    const jobs = useSelector((state: any) => state.instantjobs.data); // assuming this holds job data
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false); // ✅ new


    useInstantJobCable(subscriptionRef)

    const fetchInstantJobs = async (geocode: any, isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        try {
            await dispatch(getInstantJobs(geocode) as any);
            await dispatch(setCoords(geocode) as any);
        } catch (err) {
            console.error("Job fetch failed", err);
        } finally {
            if (isRefresh) setRefreshing(false);
        }
    };

    useEffect(() => {
        if (!isEmpty(geocoords)) {
            fetchInstantJobs(geocoords);
        }
    }, [!isEmpty(geocoords)]);

    useEffect(() => {
        (async () => {
            try {
                const granted = await requestLocationPermission();
                if (!granted) {
                    Alert.alert('Permission Denied', 'Location permission is required.');
                    return;
                }
                const { lat, lon } = await getCurrentLocation();
                dispatch(setCoords({ lat, lon }));
            } catch (err) {
                console.error("Location fetch failed:", err);
                Alert.alert('Error', 'Could not fetch location.');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // ✅ Sync jobs from redux to local state (optional based on use)
    useEffect(() => {
        setFilteredData(jobs || []);
    }, [jobs]);

    const onRefresh = () => {
        if (!isEmpty(geocoords)) {
            fetchInstantJobs(geocoords, true);
        }
    };


    const butRf = useMemo(() => {
        if (subscriptionRef.current) {
            return (<Button onPress={() => subscriptionRef.current.send({ test: 'hello' })} title='button' />)

        } else {
            return null

        }
    }, [!!subscriptionRef.current])

    const renderItem = ({ item }: any) => {

        const obj = item.attributes;


        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('JobDetailsScreen', { job_id: obj.id })}
                style={styles.card}
            >
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        <Icon name='circle' size={20} style={{ width: 20, marginTop: 8 }} color={getStatusColor(obj.status)}></Icon>
                        <Text style={styles.title}>{obj.title}</Text>

                    </View>
                    <View style={styles.row}>
                        <Text style={styles.badge}>{obj.job_category.name}</Text>
                        <View style={styles.distance}>
                            <Icon name="map-marker" size={20} color="#007bff" />
                            <Text>{obj.distance_in_km} km</Text>
                        </View>
                    </View>
                </View>
                <Text style={styles.description} numberOfLines={4} ellipsizeMode="tail">
                    {obj.description}
                </Text>
                <View style={styles.metaRow}>
                    <Text style={styles.customerName}>
                        {obj.user.full_name}{' '}
                        <Text style={styles.stars}>
                            <StarRatingDisplay
                                rating={4.5}
                                starSize={17}
                                style={{ padding: 0, margin: 5 }}
                                starStyle={{ marginHorizontal: 0 }}
                            />
                        </Text>
                    </Text>
                    <Text style={styles.timeAgo}>{dayjs(obj.created_at).fromNow()}</Text>
                </View>
            </TouchableOpacity>
        )
    };

    if (loading) return <JobsCardSkeleton />;

    return (
        <View style={styles.mainView}>
            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                refreshing={refreshing} // ✅ new
                onRefresh={onRefresh}   // ✅ new

                contentContainerStyle={[
                    styles.container,
                    { flexGrow: 1, justifyContent: filteredData.length === 0 ? 'center' : 'flex-start' }
                ]}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No jobs found nearby.</Text>
                        <Text style={styles.emptySubText}>Pull down to refresh 🔄</Text>
                    </View>
                }
            />
            {butRf}
        </View>
    );
};



const styles = StyleSheet.create({
    distance: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    mainView: {
        paddingTop: 10,
        paddingStart: 10,
        paddingEnd: 10,
    },
    container: {
        padding: 0
    },
    card: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 2
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5
    },
    badge: {
        marginTop: 5,
        backgroundColor: '#e0f7fa',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 0,
        fontSize: 12,
        color: '#00796b',
        alignSelf: 'flex-start' // ✅ auto width based on text
    },
    description: {
        fontSize: 14,
        marginTop: 6,
        color: '#444',
        lineHeight: 20,
        marginBottom: 8
    },
    date: {
        marginTop: 4,
        fontSize: 12,
        color: '#777'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between', // ⬅️ pushes left and right apart
        alignItems: 'center',
        marginTop: 8
    },

    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    customerName: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500'
    },
    stars: {
        color: '#f1c40f', // yellow stars
        marginLeft: 0,
        marginTop: 8,
        position: 'relative',
        padding: 0
    },
    timeAgo: {
        fontSize: 12,
        color: '#888'
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#555',
        fontWeight: 'bold'
    },
    emptySubText: {
        fontSize: 14,
        color: '#888',
        marginTop: 5,
    }


});

export default JobsScreen;
