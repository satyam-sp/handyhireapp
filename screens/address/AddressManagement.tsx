import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    FlatList,
    LayoutAnimation,
    Platform,
    UIManager,
    ActivityIndicator, // For loading state
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
    fetchAddresses,
    addAddress,
    deleteAddress,
    clearAddressError,
    Address // Import Address interface
} from '../../slices/userAddress.slice';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Define form inputs type
interface AddressFormInputs {
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    zip_code: string;
    address_type: string;
}

const AddressManagementScreen: React.FC<any> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { addresses, loading, error } = useSelector((state: RootState) => state.userAddress);
    // const userAuthLoading = useSelector((state: RootState) => state.userAuth.loading); // To check if user is authenticated

    const [showAddForm, setShowAddForm] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AddressFormInputs>({
        defaultValues: {
            address_line_1: '',
            address_line_2: '',
            city: '',
            state: '',
            zip_code: '',
            address_type: 'Other',
        },
    });

    // Fetch addresses on component mount
    useEffect(() => {
        dispatch(fetchAddresses() as any);
    }, []);

    // Show error alert if there's an error from the slice
    useEffect(() => {
        if (error) {
            Alert.alert('Error', error.message || 'An error occurred.');
            dispatch(clearAddressError()); // Clear error after showing
        }
    }, [error, dispatch]);

    const handleAddAddress = async (data: AddressFormInputs) => {
        LayoutAnimation.easeInEaseOut();
        const resultAction = await dispatch(addAddress(data as any) as any);

        if (addAddress.fulfilled.match(resultAction)) {
            Alert.alert('Address Added', 'Your new address has been saved.');
            reset();
            setShowAddForm(false);
        } else {
            // Error handled by useEffect, but you can add specific logic here if needed
        }
    };

    const handleRemoveAddress = (id: string) => {
        Alert.alert(
            "Remove Address",
            "Are you sure you want to remove this address?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    onPress: async () => {
                        LayoutAnimation.easeInEaseOut();
                        const resultAction = await dispatch(deleteAddress(id) as any);
                        if (deleteAddress.fulfilled.match(resultAction)) {
                            Alert.alert('Address Removed', 'The address has been successfully removed.');
                        } else {
                            // Error handled by useEffect
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const toggleAddForm = () => {
        // Check address limit before showing the form
        if (!showAddForm && addresses.length >= 3) {
            Alert.alert('Limit Reached', 'You can only save a maximum of 3 addresses.');
            return;
        }
        LayoutAnimation.easeInEaseOut();
        setShowAddForm(prev => !prev);
        if (showAddForm) {
            reset();
        }
    };

    const renderAddressItem = ({ item }: { item: Address }) => (
        <View style={styles.addressItem}>
            <View style={styles.addressDetails}>
                <Text style={styles.addressLine1}>{item.address_line_1}</Text>
                {item.address_line_2 ? <Text style={styles.addressLine2}>{item.address_line_2}</Text> : null}
                <Text style={styles.addressCityState}>{item.city}, {item.state} {item.zip_code}</Text>
                <View style={styles.addressTypeBadge}>
                    <Text style={styles.addressTypeBadgeText}>{item.address_type}</Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => handleRemoveAddress(item.id)} style={styles.removeButton}>
                <MaterialCommunityIcons name="trash-can-outline" size={24} color="#dc3545" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Manage Addresses</Text>
                <View style={styles.backButtonPlaceholder} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {loading && addresses.length === 0 ? (
                    <ActivityIndicator size="large" color="#007bff" style={styles.loadingIndicator} />
                ) : addresses.length > 0 ? (
                    <FlatList
                        data={addresses}
                        renderItem={renderAddressItem}
                        keyExtractor={(item) => item.id}
                        ListHeaderComponent={<Text style={styles.listTitle}>Your Saved Addresses</Text>}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        scrollEnabled={false}
                    />
                ) : (
                    <Text style={styles.noAddressesText}>No addresses saved yet. Add one below!</Text>
                )}

                <TouchableOpacity style={styles.addAddressToggle} onPress={toggleAddForm}>
                    <FontAwesome name={showAddForm ? "minus" : "plus"} size={20} color="#fff" />
                    <Text style={styles.addAddressToggleText}>{showAddForm ? "Hide Form" : "Add New Address"}</Text>
                </TouchableOpacity>

                {showAddForm && (
                    <View style={styles.addFormContainer}>
                        <Text style={styles.formTitle}>New Address Details</Text>
                        <Text style={styles.label}>Address Line 1*</Text>
                        <Controller
                            control={control}
                            name="address_line_1"
                            rules={{ required: 'Address is required.' }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="e.g., 123 Main Street"
                                    placeholderTextColor="#888"
                                />
                            )}
                        />
                        {errors.address_line_1 && <Text style={styles.errorText}>{errors.address_line_1.message}</Text>}

                        <Text style={styles.label}>Address Line 2 (Optional)</Text>
                        <Controller
                            control={control}
                            name="address_line_2"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="e.g., Apartment, Unit, Floor"
                                    placeholderTextColor="#888"
                                />
                            )}
                        />

                        <Text style={styles.label}>City*</Text>
                        <Controller
                            control={control}
                            name="city"
                            rules={{ required: 'City is required.' }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="e.g., Springfield"
                                    placeholderTextColor="#888"
                                />
                            )}
                        />
                        {errors.city && <Text style={styles.errorText}>{errors.city.message}</Text>}

                        <Text style={styles.label}>State*</Text>
                        <Controller
                            control={control}
                            name="state"
                            rules={{ required: 'State is required.' }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="e.g., Illinois"
                                    placeholderTextColor="#888"
                                />
                            )}
                        />
                        {errors.state && <Text style={styles.errorText}>{errors.state.message}</Text>}

                        <Text style={styles.label}>Zip Code*</Text>
                        <Controller
                            control={control}
                            name="zip_code"
                            rules={{ required: 'Zip code is required.', pattern: { value: /^\d{6}(-\d{4})?$/, message: 'Invalid zip code.' } }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="e.g., 62704"
                                    placeholderTextColor="#888"
                                    keyboardType="numeric"
                                    maxLength={6}
                                />
                            )}
                        />
                        {errors.zip_code && <Text style={styles.errorText}>{errors.zip_code.message}</Text>}

                        <Text style={styles.label}>Address Type*</Text>
                        <Controller
                            control={control}
                            name="address_type"
                            rules={{ required: 'Address type is required.' }}
                            render={({ field: { onChange, value } }) => (
                                <View style={styles.addressTypeContainer}>
                                    {['Home', 'Work', 'Other'].map(type => (
                                        <TouchableOpacity
                                            key={type}
                                            style={[
                                                styles.addressTypeOption,
                                                value === type && styles.addressTypeSelected,
                                            ]}
                                            onPress={() => onChange(type)}
                                        >
                                            <Text style={[styles.addressTypeText, value === type && styles.addressTypeTextSelected]}>
                                                {type}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        />
                        {errors.address_type && <Text style={styles.errorText}>{errors.address_type.message}</Text>}

                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleSubmit(handleAddAddress)}
                        >
                            <Text style={styles.saveButtonText}>Save New Address</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    backButtonPlaceholder: {
        width: 24 + 10,
    },
    scrollViewContent: {
        padding: 15,
        paddingBottom: 30,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    addressItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    addressDetails: {
        flex: 1,
        marginRight: 10,
    },
    addressLine1: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    addressLine2: {
        fontSize: 14,
        color: '#555',
        marginTop: 2,
    },
    addressCityState: {
        fontSize: 14,
        color: '#555',
        marginTop: 2,
    },
    addressTypeBadge: {
        backgroundColor: '#e0f7fa',
        borderRadius: 5,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    addressTypeBadgeText: {
        fontSize: 12,
        color: '#007bff',
        fontWeight: 'bold',
    },
    removeButton: {
        padding: 10,
    },
    separator: {
        height: 10,
    },
    noAddressesText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        paddingVertical: 30,
    },
    addAddressToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 20,
    },
    addAddressToggleText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    addFormContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        paddingBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    formTitle: {
        fontSize: 18,
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
    input: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
        marginBottom: 5,
    },
    addressTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    addressTypeOption: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    addressTypeSelected: {
        borderColor: '#007bff',
        backgroundColor: '#e0f7fa',
    },
    addressTypeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    addressTypeTextSelected: {
        color: '#007bff',
    },
    saveButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingIndicator: {
        marginTop: 50,
        marginBottom: 50,
    },
});

export default AddressManagementScreen;