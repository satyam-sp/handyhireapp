import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Button } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import RNPickerSelect from 'react-native-picker-select';
import JobCategory from './JobCategory';
import { useDispatch, useSelector } from 'react-redux';
import { appendEmployeeRegisterData, registerEmployee } from '../../slices/register.slice';
import { formatToINRCurrency } from '../../utils/helper';
import { useNavigation } from '@react-navigation/native';
import { setStorageData } from '../../utils/storage-helper';

const Step3JobDetails = ({ onNext }: any) => {
    const employeeData = useSelector((state: any) => state.register.empRegisterData);
    const {
        control,
        handleSubmit,
        watch,
        formState
    } = useForm({
        defaultValues: {
            experience_years: '',
            work_location: '',
            expected_pay: '',
            job_type: '',
            job_categories: []
        }
    });

    const dispatch = useDispatch()
    const navigation = useNavigation();

    const onSubmit = async (data: any) => {
        dispatch(appendEmployeeRegisterData(data))
        try{
            const response = await dispatch(registerEmployee({...employeeData,...data}) as any).unwrap();
            const result = {...response.employee, token: response.token }
            await setStorageData('employee', JSON.stringify(result))
            navigation.navigate('EmployProfile');
        }catch(e){

        }
    };

    const RupeeInput = () => {
        return (
          <Controller
            control={control}
            name="expected_pay"
            defaultValue=""
            render={({ field: { onChange, value } }) => {
              const numericValue = value?.toString().replace(/[^0-9]/g, '') || '';
      
              return (
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={value ? formatToINRCurrency(numericValue) : ''}
                  onChangeText={(text) => {
                    const cleanNumber = text.replace(/[^0-9]/g, '');
                    onChange(cleanNumber); // store raw value like "100000"
                  }}
                />
              );
            }}
          />
        );
      };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Experience (years)</Text>
            <Controller
                control={control}
                rules={{ required: 'Experience Required' }}
                name="experience_years"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.pickerWrapper}>
                        <RNPickerSelect
                            onValueChange={onChange}
                            value={value}
                            placeholder={{ label: 'Select Experience', value: '' }}
                            items={[
                                { label: '0 to 2 years', value: '0-2' },
                                { label: '2 to 5 years', value: '2-5' },
                                { label: '5 to 8 years', value: '5-8' },
                                { label: '8 to 10 years', value: '8-10' },
                                { label: '> 10 years', value: '10' }
                            ]}
                            style={pickerSelectStyles}
                        />
                    </View>
                )}
            />

            <Text style={styles.label}>Job Type</Text>
            <Controller
                control={control}
                rules={{ required: 'Job Type Required' }}
                name="job_type"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.pickerWrapper}>
                        <RNPickerSelect
                            onValueChange={onChange}
                            value={value}
                            placeholder={{ label: 'Select JobType', value: '' }}
                            items={[
                                { label: 'Full Time', value: 'fulltime' },
                                { label: 'Part Time', value: 'parttime' },
                                
                            ]}
                            style={pickerSelectStyles}
                        />
                    </View>
                )}
            />


            <Text style={styles.label}>Work Location</Text>
            <Controller
                control={control}
                rules={{ required: 'Work Location Required' }}
                name="work_location"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.pickerWrapper}>
                        <RNPickerSelect
                            onValueChange={onChange}
                            value={value}
                            placeholder={{ label: 'Select Location', value: '' }}
                            items={[
                                { label: 'Indore', value: 'indore' }
                            ]}
                            style={pickerSelectStyles}
                        />
                    </View>
                )}
            />
            <Text style={styles.label}>Expected Pay (₹)</Text>
            <RupeeInput />
            <JobCategory control={control} />



            <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    label: { marginTop: 16, fontWeight: 'bold' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        marginTop: 6,
    },
    container: {
        padding: 20,
        paddingBottom: 80,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
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

    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginTop: 8,
        marginBottom: 10,
        paddingHorizontal: 8,
        paddingVertical: 0,
    },

    buttonText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 16,
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

export default Step3JobDetails;
