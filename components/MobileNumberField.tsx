import React from 'react';
import { Controller } from 'react-hook-form';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const MobileNumberInput = ({ control, errors }: any) => {
    return (<>
        <View style={styles.inputContainer}>
            <Text style={styles.prefixText}>+91</Text>
            <Controller
                control={control}
                name="mobile_number"
                rules={{
                    required: 'Mobile number is required',
                    pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Enter valid 10-digit number',
                    },
                }}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={styles.mobileInput}
                        placeholder="Mobile Number"
                        placeholderTextColor="#888"
                        keyboardType="phone-pad"
                        maxLength={10}
                        onChangeText={(text) => {
                            const clean = text.replace(/[^0-9]/g, '');
                            onChange(`${clean}`);
                        }}
                        value={value}
                    />
                )}
            />
        </View>
        {errors.mobile_number && (
            <Text style={{ color: 'red', alignSelf: 'flex-start' }}>
                {errors.mobile_number.message}
            </Text>
        )}</>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        height: 50,
        marginVertical: 12,
    },
    prefixContainer: {
        marginRight: 8,
        borderRightWidth: 1,
        borderRightColor: '#ccc',
        paddingRight: 8,
    },
    prefixText: {
        fontSize: 20,
        color: '#000',
    },
    mobileInput: {
        flex: 1,
        fontSize: 20,
        color: '#000',
    },
});
export default MobileNumberInput;
