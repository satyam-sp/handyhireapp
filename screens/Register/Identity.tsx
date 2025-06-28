import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import {  Controller, useForm } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import { appendEmployeeRegisterData } from '../../slices/register.slice';
import { useDispatch } from 'react-redux';

const Step2Identity = ({onNext}: any) => {

  const {
      control,
      handleSubmit,
      watch,
      formState: { errors }
    } = useForm({
      defaultValues: {
        aadhaar_number: '',
        pan_number: '',
        user_image: ''
      }
    });
  const dispatch = useDispatch();


  
  const onSubmit = (data: any) => {
        dispatch(appendEmployeeRegisterData(data))
        onNext(data);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Step 2: Identity Verification</Text>

      {/* Aadhaar Number */}
      <Text style={styles.label}>Aadhaar Number *</Text>
      <Controller
        control={control}
        name="aadhaar_number"
        rules={{
          required: 'Aadhaar number is required',
          pattern: {
            value: /^[0-9]{12}$/,
            message: 'Aadhaar number must be 12 digits',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter 12-digit Aadhaar number"
            keyboardType="numeric"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.aadhaar_number && (
        <Text style={styles.error}>{errors.aadhaar_number.message}</Text>
      )}

      {/* PAN Number */}
      <Text style={styles.label}>PAN Number</Text>
      <Controller
        control={control}
        name="pan_number"
        rules={{
          pattern: {
            value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
            message: 'Invalid PAN format (e.g., ABCDE1234F)',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter PAN number (optional)"
            autoCapitalize="characters"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.pan_number && (
        <Text style={styles.error}>{errors.pan_number.message}</Text>
      )}

    <Text style={styles.label}>User Image *</Text>

    <Controller
    control={control}
    name="user_image"
    defaultValue={''}
    rules={{ required: 'Aadhaar card is required' }}
    render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={{ marginBottom: 20 }}>
        <TouchableOpacity
            style={styles.uploadBox}
            onPress={() => {
            launchImageLibrary({ mediaType: 'photo' }, (response) => {
                if (!response.didCancel && !response.errorCode && response.assets?.length) {
                const selectedImage = response.assets[0];
                onChange(selectedImage); // You can store selectedImage.uri or whole object
                }
            });
            }}
        >
            {value ? (
            <Image
                source={{ uri: value.uri }}
                style={{ width: 100, height: 100, borderRadius: 8 }}
            />
            ) : (
            <Text style={{ color: '#666' }}>Upload Aadhaar Card</Text>
            )}
        </TouchableOpacity>
        {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
        </View>
    )}
    />



    <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
    <Text style={styles.buttonText}>Next</Text>
    </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  uploadBox: {
    height: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default Step2Identity;
