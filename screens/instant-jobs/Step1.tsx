// src/screens/InstantJobPostScreen/Step1.tsx
import React, { useCallback, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { Controller, Control, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import IconButton from '../../components/IconButton';
import { styles } from './styles'; // Import shared styles
import { InstantJobFormInputs } from './index'; // Import the interface
import BottomPopup from '../../components/BottomPopup';
import ImageCheckbox from '../../components/ImageCheckbox';
import { formatToINRCurrency } from '../../utils/helper';

interface Step1Props {
    control: Control<InstantJobFormInputs>;
    errors: FieldErrors<InstantJobFormInputs>;
    watch: UseFormWatch<InstantJobFormInputs>;
    setValue: UseFormSetValue<InstantJobFormInputs>;
    handleImagePick: () => void;
    handleRemoveImage: (uri: string) => void;
    categoryTitle: string; // Used internally for modal, but passed for context
    job_categories: any; // Assuming this is imported from Register/constant
    imageMap: Record<string, any>; // Assuming this is imported from a constants file
    rateTypeOptions: { label: string; value: number }[];
    handleNextStep: () => void;
}
const { height } = Dimensions.get('window');


const Step1: React.FC<Step1Props> = ({
    control,
    errors,
    watch,
    setValue,
    handleImagePick,
    handleRemoveImage,
    job_categories,
    imageMap,
    rateTypeOptions,
    handleNextStep,
}) => {

    const [visible, setVisible] = useState(false)
    const [categoryTitle, setCategoryTitle] = useState('')
    const slideAnim = useRef(new Animated.Value(height)).current;


    const imageUris = watch('image_uris');
    const selectedRateType = watch('rate_type');
    const selectedCategoryId = watch('job_category_id');
    const jobTitleValue = watch('job_title');
    const jobDescriptionValue = watch('job_description');
    const priceValue = watch('price');


    // Determine if all required fields for Step 1 are filled
    const isStep1FieldsFilled =
        jobTitleValue !== '' &&
        jobDescriptionValue !== '' &&
        selectedCategoryId !== undefined && // Check if a category is selected
        selectedRateType !== undefined &&   // Check if a rate type is selected
        priceValue !== '';

    const isNextButtonDisabled = !isStep1FieldsFilled;


    const selectedCategoryTitle = Object.keys(job_categories).find(key =>
        job_categories[key].some((cat: any) => cat.id === selectedCategoryId)
    );

    const selectedCategoryLabel = selectedCategoryId !== undefined && selectedCategoryTitle
        ? job_categories[selectedCategoryTitle].find((cat: any) => cat.id === selectedCategoryId)?.title
        : 'Select Job Category';


    const handleVisible = useCallback((value: boolean) => {
        setVisible(value)
        setCategoryTitle('')

    }, [])

    const openModal = useCallback((title: string) => {
        setCategoryTitle(title);
        setVisible(true);

        // Delay the animation slightly to allow modal to mount first
        setTimeout(() => {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }, 300); // 50ms is usually enough
    }, []);


    const checkboxData = useCallback((value: any, onChange: any) => {

        return <View style={styles.grid1}>
            {job_categories[categoryTitle]?.map((item: any, index: number) => (
                <View key={index} style={styles.gridItem1}>
                    <ImageCheckbox
                        label={item.title}
                        value={item.id}
                        imageSource={item.image}
                        selected={value === item.id}
                        onChange={(val: any) => {


                            onChange(val);
                        }}
                    />
                </View>
            ))}
        </View>

    }, [categoryTitle])

    return (
        <View >

            <Text style={styles.label}>Job Title *</Text>
            <Controller
                control={control}
                name="job_title"
                rules={{ required: 'Job Title is required.' }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="e.g., Fix Leaky Faucet"
                        placeholderTextColor="#888"
                    />
                )}
            />
            {errors.job_title && <Text style={styles.errorText}>{errors.job_title.message}</Text>}

            {/* Job Description */}
            <Text style={styles.label}>Job Description *</Text>
            <Controller
                control={control}
                name="job_description"
                rules={{ required: 'Job Description is required.' }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="Provide a detailed description of the task."
                        placeholderTextColor="#888"
                        multiline
                        numberOfLines={4}
                    />
                )}
            />
            {errors.job_description && <Text style={styles.errorText}>{errors.job_description.message}</Text>}

            {/* Upload Images */}
            <Text style={styles.label}>Upload Images (Optional, Max 3)</Text>
            <View style={styles.imageUploadRow}>
                {imageUris.length < 3 && (
                    <TouchableOpacity style={styles.uploadButton} onPress={handleImagePick}>
                        <FontAwesome name="plus" size={24} color="#075e54" />
                        <Text style={styles.uploadButtonText}>Add Image</Text>
                    </TouchableOpacity>
                )}
                {imageUris.map((uri, index) => (
                    <View key={uri} style={styles.imagePreviewContainer}>
                        <Image source={{ uri }} style={styles.imagePreview} />
                        <TouchableOpacity onPress={() => handleRemoveImage(uri)} style={styles.removeImageButton}>
                            <FontAwesome name="times-circle" size={20} color="red" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            {/* Select Job Category */}
            <Text style={styles.label}>Select Job Category *</Text>

            <View style={styles.grid}>
                {Object.keys(job_categories).map((title, index) => <View style={styles.gridItem} key={title}>
                    <IconButton
                        title={title}
                        imageSource={imageMap[`category${index + 1}`]}
                        onPress={() => openModal(title)}
                    />
                </View>)}
            </View>

            <BottomPopup
                slideAnim={slideAnim}
                handleVisible={handleVisible}
                visible={visible}
                title={categoryTitle}
            ><Controller
                    control={control}
                    name={'job_category_id'}
                    rules={{ required: true }}
                    render={({ field: { onChange, value = [] } }) => (
                        checkboxData(value, onChange)
                    )}
                />

            </BottomPopup>


            {/* Rate Type and Price */}
            <View style={styles.fullWidth}>
                <Text style={styles.label}>Rate Type *</Text>
                <Controller
                    control={control}
                    name="rate_type"
                    rules={{ required: 'Rate Type is required.' }}
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.rateTypeContainer}>
                            {rateTypeOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.rateOption,
                                        value === option.value && styles.rateOptionSelected,
                                    ]}
                                    onPress={() => onChange(option.value)}
                                >
                                    <Text style={[
                                        styles.rateOptionText,
                                        value === option.value && styles.rateOptionTextSelected,
                                    ]}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                />
                {errors.rate_type && <Text style={styles.errorText}>{errors.rate_type.message}</Text>}
            </View>
            <View style={styles.fullWidth}>
                <Text style={styles.label}>Price *</Text>
                <Controller
                    control={control}
                    name="price"
                    defaultValue=""
                    rules={{ required: 'Price is required.', pattern: { value: /^\d+(\.\d{1,2})?$/, message: 'Invalid price' } }}
                    render={({ field: { onChange, value } }) => {
                        const numericValue = value?.toString().replace(/[^0-9]/g, '') || '';

                        return (
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={value ? formatToINRCurrency(numericValue) : ''}
                                placeholder="Enter price (e.g., 500)"
                                onChangeText={(text) => {
                                    const cleanNumber = text.replace(/[^0-9]/g, '');
                                    onChange(cleanNumber); // store raw value like "100000"
                                }}
                            />
                        );
                    }}
                />



                {errors.price && <Text style={styles.errorText}>{errors.price.message}</Text>}
            </View>

            <TouchableOpacity
                style={[styles.nextButton, isNextButtonDisabled && styles.buttonDisabled]} // Apply disabled style
                disabled={isNextButtonDisabled}
                onPress={handleNextStep}
            >
                <Text style={styles.buttonText}>Next</Text>
                <FontAwesome name="arrow-right" size={16} color="#fff" style={{ marginLeft: 10 }} />
            </TouchableOpacity>
        </View>
    );
};

export default Step1;