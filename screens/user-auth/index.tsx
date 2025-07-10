import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
    ActivityIndicator, // For loading state
    Alert, // For showing errors
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import * as Animatable from 'react-native-animatable';
import LogoSVG from '../../assets/svgs/logo.svg'; // Your actual SVG
import MobileNumberInput from '../../components/MobileNumberField';
import { setStorageData } from '../../utils/storage-helper';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, verifyOtpAndLogin, clearAuthError, setUserData } from '../../slices/userAuth.slice'; // Import new actions
import { RootState } from '../../store'; // Import RootState type if using TypeScript

const UserAuthScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const { loading, otpSent, error, user, token } = useSelector(
        (state: RootState) => state.userAuth
    );

    const [otp, setOtp] = useState('');

    const {
        control,
        handleSubmit,
        formState: { errors },
        getValues, // To get the mobile number for OTP verification
    } = useForm({
        defaultValues: {
            mobile_number: '',
        },
    });

    const handleSendOtp = async (data: { mobile_number: string }) => {
        console.log('Sending OTP for:', data.mobile_number);
        const resultAction = await dispatch(sendOtp(data.mobile_number) as any);
        if (sendOtp.fulfilled.match(resultAction)) {
            // OTP sent successfully, navigate to OTP verification or show OTP input
            Alert.alert('Success', 'OTP sent to your mobile number!');
        } else {
            const errorMessage = resultAction.payload?.message || 'Failed to send OTP.';
            Alert.alert('Error', errorMessage);
            dispatch(clearAuthError());
        }
    };

    const handleVerifyOtp = async () => {
        const mobile_number = getValues('mobile_number');
        if (!mobile_number || !otp) {
            Alert.alert('Error', 'Please enter your mobile number and OTP.');
            return;
        }

        console.log('Verifying OTP:', otp, 'for mobile:', mobile_number);
        const resultAction = await dispatch(verifyOtpAndLogin({ mobile_number, otp }) as any);

        if (verifyOtpAndLogin.fulfilled.match(resultAction)) {
            // Login/creation successful
            const { user, token } = resultAction.payload;
            const result = { ...user, token: token, role: 'user' };
            await setStorageData('user', JSON.stringify(result));
            dispatch(setUserData({user, token}))
            if (!user.full_name || user.full_name.trim() === '') {
                navigation.navigate('FullNameScreen'); // Or your main dashboard
            }else{
                navigation.navigate('UserProfile')
            }
        } else {
            const errorMessage = resultAction.payload?.message || 'Failed to verify OTP.';
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
                <Text style={styles.infoTextHeading}>Login/Create Account</Text>
                <Text style={styles.infoTextHeading}>Enter your mobile number to proceed</Text>

                {/* Mobile Number Field */}
                <MobileNumberInput control={control} errors={errors} />

                {otpSent && (
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter OTP"
                            keyboardType="numeric"
                            value={otp}
                            onChangeText={setOtp}
                            maxLength={6} // Assuming 6-digit OTP
                            placeholderTextColor="#888"
                        />
                    </View>
                )}

                {errors.mobile_number && (
                    <Text style={{ color: 'red', alignSelf: 'flex-start' }}>
                        {errors.mobile_number.message}
                    </Text>
                )}


                {!otpSent ? (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSubmit(handleSendOtp)}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>{!loading ? 'Send OTP' : 'Please Wait...'} </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleVerifyOtp}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>Verify OTP & Login</Text>
                    </TouchableOpacity>
                )}
            </View>

            <Image
                source={require('../../assets/worker2.png')}
                style={styles.image}
                resizeMode="contain"
            />

            <View style={styles.actionPanel}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Welcome')}
                >
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginVertical: 10,
        height: 48,
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    prefix: {
        fontSize: 16,
        marginRight: 8,
        color: '#000',
    },
    actionPanel: {
        bottom: 30,
        width: '100%',
        position: 'absolute'
    },
    infoTextHeading: {
        fontSize: 22,
        fontStyle: 'normal',
        fontWeight: '600', // Use string for fontWeight
        paddingBottom: 15
    },
    infoText: {
        fontSize: 18,
        fontStyle: 'normal',
        fontWeight: '500' // Use string for fontWeight
    },

    infoTextBlock: {
        marginBlockStart: 0,
        marginRight: 0,
        position: 'absolute',
        marginTop: 150,
        width: '100%'
    },

    innerContainer: {
        position: 'relative',
        bottom: 200

    },
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // This 'input' style is duplicated, consider merging or renaming
    // input: {
    //     borderWidth: 1,
    //     color: '#000',
    //     borderColor: '#ccc',
    //     fontSize: 20,
    //     padding: 14,
    //     marginBottom: 16,
    //     borderRadius: 10,
    // },
    logo: {
        alignSelf: 'flex-start',
        marginLeft: 0,
        marginRight: 50
    },
    logoImage: {
        marginTop: 50,
        position: 'relative'
    },
    logoText: {
        fontSize: 24,
        bottom: 20,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'left',
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: '#333',
        marginBottom: 24,
        alignSelf: 'flex-start',

    },
    image: {
        width: 280,
        height: 350,
        marginBottom: 0,
        marginTop: 380,
        marginLeft: 170,
        position: 'absolute',
        zIndex: 99999
    },
    button: {
        backgroundColor: '#f8e71c',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        width: '100%',
        marginBottom: 0,
        zIndex: 99999,
        alignItems: 'center',
        marginTop: 10, // Added some margin for spacing
    },
    buttonText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default UserAuthScreen;