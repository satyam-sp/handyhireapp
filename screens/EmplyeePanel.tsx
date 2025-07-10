import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import * as Animatable from 'react-native-animatable';
import LogoSVG from '../assets/svgs/logo.svg'; // Your actual SVG
import MobileNumberInput from '../components/MobileNumberField';
import { setStorageData } from '../utils/storage-helper';
import { useDispatch } from 'react-redux';
import { loginEmployee, registerEmployee } from '../slices/register.slice';

const EmployeePanel = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            mobile_number: '',
            password: '',
        },
    });

    const onSubmit = async(data: any) => {
        console.log('Form Submitted:', data);
        // Example: API call or navigate
        // navigation.navigate('Dashboard');
        try {
            const response = await dispatch(loginEmployee(data) as any).unwrap();
            const result = { ...response.employee, token: response.token, role: 'employee' }
            await setStorageData('user', JSON.stringify(result))
            navigation.navigate('EmployProfile');
        } catch (e) {

        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <Animatable.Text animation="bounceIn" style={styles.logo}>
                    <LogoSVG />
                </Animatable.Text>
                <Text style={styles.infoTextHeading}>Sign-in as Employee</Text>

                {/* Mobile Number Field */}
                <MobileNumberInput control={control} errors={errors} />


                {/* Password Field */}
                <Controller
                    control={control}
                    name="password"
                    rules={{ required: 'Password is required' }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#888"
                            secureTextEntry
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.password && (
                    <Text style={{ color: 'red', alignSelf: 'flex-start' }}>
                        {errors.password.message}
                    </Text>
                )}

                <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                    <Text style={styles.buttonText}>Sign in</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.infoTextBlock}>
                <Text style={styles.infoTextHeading}>Register as Employee</Text>
                <Text style={styles.infoText}>Step1: Basic Information</Text>
                <Text style={styles.infoText}>Step2: Job Details</Text>
            </View>

            <Image
                source={require('../assets/worker2.png')}
                style={styles.image}
                resizeMode="contain"
            />

            <View style={styles.actionPanel}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.buttonText}>Start Registration</Text>
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
        fontWeight: 600,
        paddingBottom: 15
    },
    infoText: {
        fontSize: 18,
        fontStyle: 'normal',
        fontWeight: 500
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
    input: {
        borderWidth: 1,
        color: '#000',
        borderColor: '#ccc',
        fontSize: 20,
        padding: 14,
        marginBottom: 16,
        borderRadius: 10,
    },
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
    },
    buttonText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default EmployeePanel;
