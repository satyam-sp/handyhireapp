import React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    Button
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { appendEmployeeRegisterData } from '../../slices/register.slice';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const BasicInfoStep = ({ onNext }: any) => {


    
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            fullName: '',
            mobileNumber: '',
            gender: '',
            address: '',
            dateOfBirth: new Date(),
            password: '',
            confirmPassword: '',
            currentAddress: '',
            sameAsPermanentAddress: false,
        }
    });
    const dispatch = useDispatch();

    const sameAsPermanentAddress = watch('sameAsPermanentAddress');

    const [showDatePicker, setShowDatePicker] = React.useState(false);
    const dateOfBirth = watch('dateOfBirth');

    const onSubmit = (data: any) => {
        dispatch(appendEmployeeRegisterData(data))
        onNext(data);
    };

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <Text style={styles.title}>Basic Information</Text>

                {/* Full Name */}
                <Text style={styles.label}>Full Name *</Text>
                <Controller
                    control={control}
                    rules={{ required: 'Full name is required' }}
                    name="fullName"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your full name"
                            value={value}
                            onChangeText={onChange}
                        />
                    )}
                />
                {errors.fullName && <Text style={styles.error}>{errors.fullName.message}</Text>}

                {/* Mobile Number */}
                <Text style={styles.label}>Mobile Number *</Text>
                <Controller
                    control={control}
                    rules={{
                        required: 'Mobile number is required',
                        pattern: {
                            value: /^[0-9]{10}$/,
                            message: 'Mobile number must be 10 digits'
                        }
                    }}
                    name="mobileNumber"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your mobile number"
                            keyboardType="phone-pad"
                            value={value}
                            onChangeText={onChange}
                        />
                    )}
                />
                {errors.mobileNumber && <Text style={styles.error}>{errors.mobileNumber.message}</Text>}

                {/* Gender */}
                <Text style={styles.label}>Gender *</Text>
                <Controller
                    control={control}
                    rules={{ required: 'Gender is required' }}
                    name="gender"
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.pickerWrapper}>

                            <RNPickerSelect
                                onValueChange={onChange}
                                value={value}
                                placeholder={{ label: 'Select Gender', value: '' }}
                                items={[
                                    { label: 'Male', value: 'male' },
                                    { label: 'Female', value: 'female' },
                                    { label: 'Other', value: 'other' }
                                ]}
                                style={pickerSelectStyles}
                            />
                        </View>
                    )}
                />
                {errors.gender && <Text style={styles.error}>{errors.gender.message}</Text>}

                {/* Date of Birth */}
                <Text style={styles.label}>Date of Birth *</Text>
                <TouchableOpacity
                    style={styles.datePicker}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text>{dateOfBirth?.toDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={dateOfBirth || new Date()}
                        mode="date"
                        display="default"
                        maximumDate={new Date()}
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(Platform.OS === 'ios');
                            if (selectedDate) {
                                let dateup = (event.nativeEvent as any).timestamp as any
                                (control as any).setValue('dateOfBirth', dateup);
                            }
                        }}
                    />
                )}

                {/* Password */}
                <Text style={styles.label}>Password *</Text>
                <Controller
                    control={control}
                    rules={{
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    }}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter password"
                            secureTextEntry
                            value={value}
                            onChangeText={onChange}
                        />
                    )}
                />
                {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

                {/* Confirm Password */}
                <Text style={styles.label}>Confirm Password *</Text>
                <Controller
                    control={control}
                    name="confirmPassword"
                    rules={{
                        required: 'Please confirm password',
                        validate: value =>
                            value === watch('password') || 'Passwords do not match'
                    }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Re-enter password"
                            secureTextEntry
                            value={value}
                            onChangeText={onChange}
                        />
                    )}
                />
                {errors.confirmPassword && (
                    <Text style={styles.error}>{errors.confirmPassword.message}</Text>
                )}

                {/* Permanent Address */}
                <Text style={styles.label}>Permanent Address *</Text>
                <Controller
                    control={control}
                    rules={{ required: 'Permanent address is required' }}
                    name="address"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={[styles.input, { height: 80 }]}
                            placeholder="Enter your permanent address"
                            multiline
                            value={value}
                            onChangeText={onChange}
                        />
                    )}
                />
                {errors.address && (
                    <Text style={styles.error}>{errors.address.message}</Text>
                )}

                {/* Checkbox for same address */}
                <View style={styles.checkboxRow}>
                    <Controller
                        control={control}
                        name="sameAsPermanentAddress"
                        render={({ field: { onChange, value } }) => (
                            <TouchableOpacity
                                style={styles.checkbox}
                                onPress={() => onChange(!value)}
                            >
                                <View style={[styles.checkboxBox, value && styles.checkboxBoxChecked]} />
                                <Text style={styles.checkboxText}>Current address same as permanent</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>

                {/* Current Address (only show if not same as permanent) */}
                {!sameAsPermanentAddress && (
                    <>
                        <Text style={styles.label}>Current Address *</Text>
                        <Controller
                            control={control}
                            rules={{ required: 'Current address is required' }}
                            name="currentAddress"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={[styles.input, { height: 80 }]}
                                    placeholder="Enter your current address"
                                    multiline
                                    value={value}
                                    onChangeText={onChange}
                                />
                            )}
                        />
                        {errors.currentAddress && (
                            <Text style={styles.error}>{errors.currentAddress.message}</Text>
                        )}
                    </>
                )}


                <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
              
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default BasicInfoStep;

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    container: {
        padding: 20,
        paddingBottom: 40
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20
    },
    label: {
        marginBottom: 4,
        fontWeight: '600',
        fontSize: 15,
        color: '#333'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        color: '#000',
        borderRadius: 10,
        marginBottom: 12
    },
    error: {
        color: 'red',
        marginBottom: 10
    },
    datePicker: {
        padding: 12,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ccc',
        marginBottom: 12
    },
    button: {
        padding: 14,
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: '#f8e71c',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        width: '100%',
        marginBottom: 12,
    },


    buttonText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 16,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 10,
        marginTop: 8,
        paddingHorizontal: 8,
        paddingVertical: 0,
    },
    checkboxRow: {
        marginBottom: 12,
        marginTop: 6,
    },
    checkbox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxBox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: 8,
        borderRadius: 4,
    },
    checkboxBoxChecked: {
        backgroundColor: '#f8e71c',
    },
    checkboxText: {
        fontSize: 15,
        color: '#333',
    },

});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        color: '#000', // optional
        marginBottom: 10,
    },
    inputAndroid: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        color: '#000', // optional
        marginBottom: 10,
    },
});