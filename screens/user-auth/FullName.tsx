import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import * as Animatable from 'react-native-animatable';
import LogoSVG from '../../assets/svgs/logo.svg';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserData, clearAuthError } from '../../slices/userAuth.slice';
import { RootState } from '../../store';
import { setStorageData } from '../../utils/storage-helper';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome

interface FullNameFormInputs {
    full_name: string;
    gender: 'Male' | 'Female' | 'Other' | ''; // Add gender to form inputs
}

const FullNameScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const { loading, error, user } = useSelector((state: RootState) => state.userAuth);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue, // To programmatically set gender value
        watch, // To watch for changes in gender value for styling
    } = useForm<FullNameFormInputs>({
        defaultValues: {
            full_name: user?.full_name || '',
            gender: user?.gender || 'Male', // Pre-fill gender if available
        },
    });

    const selectedGender = watch('gender'); // Watch the gender field

    const onSubmit = async (data: FullNameFormInputs) => {
        console.log('Updating Profile:', data);
        if (!data.full_name.trim()) {
            Alert.alert('Error', 'Full Name cannot be empty.');
            return;
        }
        if (!data.gender.trim()) {
            Alert.alert('Error', 'Please select your Gender.');
            return;
        }

        const resultAction = await dispatch(updateUserData(data) as any);

        if (updateUserData.fulfilled.match(resultAction)) {
            Alert.alert('Success', 'Profile updated successfully!');
            if (resultAction.payload.user) {
                 const updatedUserData = { ...resultAction.payload.user, token: user?.token, role: 'user' };
                 await setStorageData('employee', JSON.stringify(updatedUserData));
            }
            navigation.navigate('EmployProfile');
        } else {
            const errorMessage = resultAction.payload?.message || 'Failed to update profile.';
            Alert.alert('Error', errorMessage);
            dispatch(clearAuthError());
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <Animatable.Text animation="bounceIn" style={styles.logo}>
                    <LogoSVG />
                </Animatable.Text>
                <Text style={styles.infoTextHeading}>Complete Your Profile</Text>
                <Text style={styles.infoTextSubHeading}>Please enter your full name and select your gender.</Text>

                <Controller
                    control={control}
                    name="full_name"
                    rules={{ required: 'Full Name is required.' }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Enter your Full Name"
                                placeholderTextColor="#888"
                                autoCapitalize="words"
                            />
                        </View>
                    )}
                />
                {errors.full_name && (
                    <Text style={styles.errorText}>{errors.full_name.message}</Text>
                )}

                {/* Gender Selection */}
       
                <Controller
                    control={control}
                    name="gender"
                    rules={{ required: 'Gender is required.' }}
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.genderOptionsContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.genderButton,
                                    selectedGender === 'Male' && styles.genderButtonSelected,
                                ]}
                                onPress={() => onChange('Male')}
                            >
                                <FontAwesome name="male" size={24} color={selectedGender === 'Male' ? '#fff' : '#333'} />
                                <Text style={[styles.genderButtonText, selectedGender === 'Male' && styles.genderButtonTextSelected]}>Male</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.genderButton,
                                    selectedGender === 'Female' && styles.genderButtonSelected,
                                ]}
                                onPress={() => onChange('Female')}
                            >
                                <FontAwesome name="female" size={24} color={selectedGender === 'Female' ? '#fff' : '#333'} />
                                <Text style={[styles.genderButtonText, selectedGender === 'Female' && styles.genderButtonTextSelected]}>Female</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.genderButton,
                                    selectedGender === 'Other' && styles.genderButtonSelected,
                                ]}
                                onPress={() => onChange('Other')}
                            >
                                <FontAwesome name="genderless" size={24} color={selectedGender === 'Other' ? '#fff' : '#333'} />
                                <Text style={[styles.genderButtonText, selectedGender === 'Other' && styles.genderButtonTextSelected]}>Other</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
                {errors.gender && (
                    <Text style={styles.errorText}>{errors.gender.message}</Text>
                )}

                {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.activityIndicator} />}

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit(onSubmit)}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>{!loading ? 'Save & Continue' : 'Saving...'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerContainer: {
        position: 'relative',
        bottom: 50, // Adjusted to make space for more fields
        width: '100%',
        alignItems: 'center',
    },
    logo: {
        alignSelf: 'flex-start',
        marginLeft: 0,
        marginRight: 50,
        marginBottom: 20,
    },
    infoTextHeading: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    infoTextSubHeading: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
        textAlign: 'center',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginVertical: 10,
        height: 50,
        backgroundColor: '#fff',
        width: '100%',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    errorText: {
        color: 'red',
        alignSelf: 'flex-start',
        marginBottom: 10,
        marginLeft: 5,
        fontSize: 14,
    },
    activityIndicator: {
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#f8e71c',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        width: '100%',
        marginBottom: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 16,
    },
    // New styles for Gender Selection
    genderLabel: {
        alignSelf: 'flex-start',
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginTop: 10,
        marginBottom: 10,
    },
    genderOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    genderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        minWidth: 100,
    },
    genderButtonSelected: {
        backgroundColor: '#007bff', // Or any color to indicate selection
        borderColor: '#007bff',
    },
    genderButtonText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    genderButtonTextSelected: {
        color: '#fff',
    },
});

export default FullNameScreen;