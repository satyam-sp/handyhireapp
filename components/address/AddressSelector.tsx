import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
    PermissionsAndroid,
    Platform,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';
import { useNavigation } from '@react-navigation/native';

interface Address {
    id: string;
    type: 'Home' | 'Work' | 'Friend' | 'Other' | 'Current';
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    zip_code: string;
    latitude?: number;
    longitude?: number;
}

interface AddressSelectorProps {
    onAddressSelect: (address: Address | null) => void;
    selectedAddressId: string | null;
    savedAddresses: any[];
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
    onAddressSelect,
    selectedAddressId,
    savedAddresses,
}) => {
    const navigation = useNavigation(); // Get navigation object for sub-buttons
    const [loadingCurrentLocation, setLoadingCurrentLocation] = useState(false);

    // ... (requestLocationPermission and getCurrentLocation functions are the same) ...
    const requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            const status = await Geolocation.requestAuthorization('whenInUse');
            return status === 'granted';
        } else if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Access Permission',
                        message: 'We need access to your location so you can find job locations.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return false;
    };
    
    const getCurrentLocation = async () => {
        setLoadingCurrentLocation(true);
        const hasPermission = await requestLocationPermission();

        if (!hasPermission) {
            Alert.alert(
                'Permission Denied',
                'Please enable location services in your device settings to use this feature.'
            );
            setLoadingCurrentLocation(false);
            return;
        }

        Geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                // In a real app, you'd reverse geocode these coordinates to get an address string.
                // For simplicity, we'll create a mock address.
                const mockAddress: Address = {
                    id: 'current_location',
                    type: 'Current',
                    address_line_1: 'Current Location',
                    address_line_2: `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`,
                    city: 'Indore',
                    state: 'Madhya Pradesh',
                    zip_code: '',
                    latitude,
                    longitude,
                };
                onAddressSelect(mockAddress);
                setLoadingCurrentLocation(false);
            },
            (error) => {
                console.error('Geolocation Error:', error);
                Alert.alert('Location Error', `Code ${error.code}: ${error.message}`);
                setLoadingCurrentLocation(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    const getAddressIcon = (type: string) => {
        switch (type) {
            case 'Home': return 'home';
            case 'Work': return 'work';
            case 'Friend': return 'people';
            case 'Current': return 'my-location';
            default: return 'location-on';
        }
    };


    const handleManageAddresses = () => {
        (navigation.navigate as any)('AddressManagement'); // Make sure 'AddressManagement' is the route name
    };


    return (
        <View style={styles.addressSection}>
            <Text style={styles.label}>Job Location</Text>

            {/* Current Location Button */}
            <TouchableOpacity
                style={styles.currentLocationButton}
                onPress={getCurrentLocation}
                disabled={loadingCurrentLocation}
            >
                {loadingCurrentLocation ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <>
                        <MaterialIcons name="my-location" size={20} color="#fff" />
                        <Text style={styles.currentLocationButtonText}>{selectedAddressId === 'current_location' ? 'Selected Current Location': 'Use Current Location'} </Text>
                    </>
                )}
            </TouchableOpacity>

            {/* Saved Addresses & Add New Address */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.addressScrollContainer}>
                {savedAddresses.map((address) => (
                    <TouchableOpacity
                        key={address.id}
                        style={[
                            styles.addressOption,
                            selectedAddressId === address.id && styles.addressOptionSelected,
                        ]}
                        onPress={() => onAddressSelect(address)}
                    ><View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcons
                            name={getAddressIcon(address.type)}
                            size={20}
                            color={selectedAddressId === address.id ? '#fff' : '#075e54'}
                        />
                        <Text style={[
                            styles.addressTypeText,
                            selectedAddressId === address.id && styles.addressTextSelected,
                        ]}>
                            {address.type || 'Other'} 
                        </Text>
                        </View>
                        <Text style={[
                            styles.addressLine1Text,
                            selectedAddressId === address.id && styles.addressTextSelected,
                        ]} numberOfLines={1}>
                            {address.address_line_1}
                        </Text>
                        <Text style={[
                            styles.addressLine1Text,
                            selectedAddressId === address.id && styles.addressTextSelected,
                        ]} numberOfLines={1}>
                            {address.address_line_2}
                        </Text>
                    </TouchableOpacity>
                ))}
                
                {/* Add New Address Card */}
                <TouchableOpacity
                    style={styles.addAddressCard}
                    onPress={handleManageAddresses} // <--- OPEN MODAL
                >
                    <FontAwesome name="plus-circle" size={24} color="#075e54" />
                    <Text style={styles.addAddressText}>Add New</Text>
                </TouchableOpacity>
            </ScrollView>

     
        </View>
    );
};

const styles = StyleSheet.create({
    addressSection: {
        marginTop: 15,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        marginBottom: 8,
    },
    currentLocationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#075e54',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 15,
        justifyContent: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    currentLocationButtonText: {
        marginLeft: 10,
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    addressScrollContainer: {
        paddingVertical: 5,
    },
    addressOption: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 15,
        marginRight: 10,
        minWidth: 150,
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    addressOptionSelected: {
        backgroundColor: '#075e54',
        borderColor: '#075e54',
    },
    addressTypeText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5,
        color: '#333',
    },
    addressLine1Text: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    addressTextSelected: {
        color: '#fff',
    },
    addAddressCard: {
        minWidth: 150,
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#075e54',
        borderRadius: 10,
        padding: 15,
    },
    addAddressText: {
        marginTop: 8,
        color: '#075e54',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default AddressSelector;