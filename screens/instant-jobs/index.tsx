// src/screens/InstantJobPostScreen/index.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Dimensions,
    Alert,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { postInstantJob, clearInstantJobError } from '../../slices/instantJob.slice';
import { RootState } from '../../store';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import dayjs from 'dayjs';
import { launchImageLibrary } from 'react-native-image-picker';
import { fetchAddresses } from '../../slices/userAddress.slice';
// Import the category data and image map
import { job_categories } from '../../screens/Register/constant'; // Adjust path if necessary
import { imageMap } from './constants'; // Will create this file for imageMap

import Step1 from './Step1'; // Import Step1 component
import Step2 from './Step2'; // Import Step2 component
import { styles } from './styles'; // Import shared styles

const DEFAULT_TIME_SLOT = "10:00 AM - 12:00 PM";
const { height } = Dimensions.get('window');

// Define Address type (should match the one in AddressSelector.js)
export interface Address {
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

// Define the form inputs interface
export interface InstantJobFormInputs {
    job_title: string;
    job_description: string;
    slot_date: string;
    job_category_id: number;
    rate_type: number; // Changed to number based on previous discussion
    price: string;
    image_uris: string[];
    selected_address_id?: string;
    selected_address?: any;
    slot_time: string;
}

const InstantJobPostScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [currentStep, setCurrentStep] = useState(1);
    const [visible, setVisible] = useState(false); // For BottomPopup
    const [categoryTitle, setCategoryTitle] = useState(''); // For BottomPopup
    const slideAnim = useRef(new Animated.Value(height)).current; // For BottomPopup animation

    const { loading, error } = useSelector((state: RootState) => state.instantjob);
    const savedUserAddresses = useSelector((state: RootState) => state.userAddress?.addresses || []);

    // Rate type options moved here as it's used across components (or could be in a constants file)
    const rateTypeOptions = [
        { label: 'Per Hour', value: 0 },
        { label: 'Per Day', value: 1 },
        { label: 'Per Job', value: 2 },
    ];

    useEffect(() => {
        dispatch(fetchAddresses() as any);
    }, []);

    const {
        control,
        getValues,
        handleSubmit,
        setValue,
        watch,
        trigger,
        formState: { errors },
    } = useForm<InstantJobFormInputs>({
        defaultValues: {
            job_title: '',
            job_description: '',
            slot_date: '',
            job_category_id: undefined, // Initialize
            rate_type: undefined, // Initialize
            price: '',
            image_uris: [],
            selected_address_id: undefined,
            selected_address: undefined,
            slot_time: DEFAULT_TIME_SLOT,
        },
    });

    const selectedDate = watch('slot_date');
    const imageUris = watch('image_uris');
    const selectedAddress = watch('selected_address');
    const selectedRateType = watch('rate_type');
    const selectedCategoryId = watch('job_category_id');

    // Generate dates for the next few days using Day.js
    const getDates = () => {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = dayjs().add(i, 'day');
            dates.push({
                fullDate: date.format('YYYY-MM-DD'),
                displayDay: date.format('DD MMM'),
                displayYear: date.format('YYYY'),
            });
        }
        return dates;
    };
    const dates = getDates();

    // Image Picker Handlers
    const handleImagePick = useCallback(() => {
        if (imageUris.length >= 3) {
            Alert.alert('Limit Reached', 'You can only upload up to 3 images.');
            return;
        }

        launchImageLibrary(
            {
                mediaType: 'photo',
                quality: 0.7,
                selectionLimit: 3 - imageUris.length,
            },
            (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.errorCode) {
                    console.log('ImagePicker Error: ', response.errorCode, response.errorMessage);
                    Alert.alert('Error picking image', response.errorMessage || 'An unknown error occurred.');
                } else if (response.assets) {
                    const newImageUris = response.assets.map(asset => asset.uri).filter(uri => uri !== undefined) as string[];
                    setValue('image_uris', [...imageUris, ...newImageUris]);
                }
            }
        );
    }, [imageUris, setValue]);

    const handleRemoveImage = useCallback((uriToRemove: string) => {
        Alert.alert(
            'Remove Image',
            'Are you sure you want to remove this image?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    onPress: () => {
                        setValue('image_uris', imageUris.filter(uri => uri !== uriToRemove));
                    },
                    style: 'destructive',
                },
            ]
        );
    }, [imageUris, setValue]);

    // Address Selector Handler
    const handleAddressSelect = useCallback((address: Address | null) => {
        setValue('selected_address', address || undefined);
        setValue('selected_address_id', address ? address.id : undefined);
    }, [setValue]);

    // Time Slot Selector Handler
    const setSelectedSlotId = useCallback((val: string) => {
        setValue('slot_time', val);
    }, [setValue]);

    // Bottom Popup Handlers

    // Render function for ImageCheckbox content within the modal

    // Stepper Navigation Handlers
    const handleNextStep = async () => {
        let isValid = false;
        if (currentStep === 1) {
            isValid = await trigger(['job_title', 'job_description', 'job_category_id', 'rate_type', 'price']);

            // Additional check for job_category_id as it's not a direct input
            if (selectedCategoryId === undefined) {
                Alert.alert('Validation Error', 'Please select a job category.');
                isValid = false;
            }
             // Additional check for rate_type as it's not a direct input
            if (selectedRateType === undefined) {
                Alert.alert('Validation Error', 'Please select a rate type.');
                isValid = false;
            }

            if (isValid) {
                setCurrentStep(2);
            } else {
                // If validation fails, errors will be displayed by react-hook-form
                // Alert.alert('Validation Error', 'Please fill in all required fields for this step.');
            }
        }
    };

    const handlePreviousStep = () => {
        setCurrentStep(1);
    };

    // Final form submission
    const onSubmit = async (data: InstantJobFormInputs) => {
     

        // IMPORTANT: In a real app, you would:
        // 1. Upload images to storage (e.g., S3, Cloudinary).
        // 2. Get the public URLs for those images.
        // 3. Send these public URLs in your payload.
        // For this example, we're passing local URIs or mock data for `image_urls`.

        const payload = {
            title: data.job_title,
            description: data.job_description,
            job_category_id: data.job_category_id,
            slot_date: data.slot_date,
            slot_time: data.slot_time,
            rate_type: data.rate_type,
            price: data.price,
            image_urls: imageUris, // Replace with actual image URLs after upload
            address_line_1: selectedAddress.address_line_1,
            address_line_2: selectedAddress.address_line_2,
            city: selectedAddress.city,
            state: selectedAddress.state,
            zip_code: selectedAddress.zip_code,
            latitude: selectedAddress.latitude || 22.687559,
            longitude: selectedAddress.longitude || 75.858902,
        };

        const resultAction = await dispatch(postInstantJob(payload) as any);

        if (postInstantJob.fulfilled.match(resultAction)) {
            Alert.alert('Success', 'Instant Job posted successfully!');
            navigation.goBack();
        } else {
            const errorMessage = resultAction.payload?.message || 'Failed to post instant job.';
            Alert.alert('Error', errorMessage);
            dispatch(clearInstantJobError());
        }
    };

    // Stepper Indicator component moved to render function
    const renderStepperIndicator = () => (
        <View style={styles.stepperContainer}>
            <View style={styles.stepIndicatorRow}>
                <View style={[styles.stepDot, currentStep === 1 && styles.stepDotActive]} />
                <View style={styles.stepLine} />
                <View style={[styles.stepDot, currentStep === 2 && styles.stepDotActive]} />
            </View>
            <View style={styles.stepTextRow}>
                <Text style={[styles.stepText, currentStep === 1 && styles.stepTextActive]}>Job Details</Text>
                <Text style={[styles.stepText, currentStep === 2 && styles.stepTextActive]}>Time & Location</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingContainer}
            >
                <ScrollView contentContainerStyle={styles.container}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <FontAwesome name="arrow-left" size={24} color="#555" />
                    </TouchableOpacity>
                    {renderStepperIndicator()}
                    {currentStep === 1 ? (
                        <Step1
                            control={control}
                            errors={errors}
                            watch={watch}
                            setValue={setValue}
                            handleImagePick={handleImagePick}
                            handleRemoveImage={handleRemoveImage}
                            categoryTitle={categoryTitle}
                            job_categories={job_categories}
                            imageMap={imageMap}
                            rateTypeOptions={rateTypeOptions}
                            handleNextStep={handleNextStep}
                        />
                    ) : (
                        <Step2
                            control={control}
                            errors={errors}
                            watch={watch}
                            setValue={setValue}
                            selectedAddress={selectedAddress}
                            savedUserAddresses={savedUserAddresses}
                            handleAddressSelect={handleAddressSelect}
                            setSelectedSlotId={setSelectedSlotId}
                            dates={dates}
                            handlePreviousStep={handlePreviousStep}
                            onSubmit={handleSubmit(onSubmit)} // Pass onSubmit wrapped with handleSubmit
                            getValues={getValues}
                        />
                    )}

                   
                </ScrollView>
            </KeyboardAvoidingView>
            {loading && ( // Global loading indicator for the whole screen
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#007bff" />
                </View>
            )}
        </SafeAreaView>
    );
};

export default InstantJobPostScreen;