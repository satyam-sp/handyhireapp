// src/screens/InstantJobPostScreen/Step2.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Control, FieldErrors, UseFormWatch, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import AddressSelector from '../../components/address/AddressSelector';
import TimeSlotSelector from '../../components/TimeSlotSelector';
import { styles } from './styles'; // Import shared styles
import { InstantJobFormInputs, Address } from './index'; // Import interfaces

interface Step2Props {
    control: Control<InstantJobFormInputs>;
    errors: FieldErrors<InstantJobFormInputs>;
    watch: UseFormWatch<InstantJobFormInputs>;
    setValue: UseFormSetValue<InstantJobFormInputs>;
    getValues: UseFormGetValues<InstantJobFormInputs>;
    selectedAddress: Address | undefined;
    savedUserAddresses: any[];
    handleAddressSelect: (address: Address | null) => void;
    setSelectedSlotId: (val: string) => void;
    dates: { fullDate: string; displayDay: string; displayYear: string }[];
    handlePreviousStep: () => void;
    onSubmit: () => void; // This will be handleSubmit(onSubmit) from index.tsx
}

const Step2: React.FC<Step2Props> = ({
    control,
    errors,
    watch,
    setValue,
    getValues,
    selectedAddress,
    savedUserAddresses,
    handleAddressSelect,
    setSelectedSlotId,
    dates,
    handlePreviousStep,
    onSubmit,
}) => {
    const selectedDate = watch('slot_date');
    const selectedSlotTime = watch('slot_time');
    const watchSelectedAddress = watch('selected_address');

    const isStep2FieldsFilled =
    selectedDate !== '' &&
    selectedSlotTime !== '' &&
    watchSelectedAddress !== undefined 

   const isNextButtonDisabled = !isStep2FieldsFilled;

    return (
        <View >
            {/* Date Selection */}
            <Text style={styles.label}>Select Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datePickerContainer}>
                {dates.map((dateItem) => (
                    <TouchableOpacity
                        key={dateItem.fullDate}
                        style={[
                            styles.dateOption,
                            selectedDate === dateItem.fullDate && styles.dateOptionSelected,
                        ]}
                        onPress={() => setValue('slot_date', dateItem.fullDate, { shouldValidate: true })}
                    >
                        <Text style={[
                            styles.dateDay,
                            selectedDate === dateItem.fullDate && styles.dateTextSelected,
                        ]}>
                            {dateItem.displayDay}
                        </Text>
                        <Text style={[
                            styles.dateYear,
                            selectedDate === dateItem.fullDate && styles.dateTextSelected,
                        ]}>
                            {dateItem.displayYear}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            {errors.slot_date && <Text style={styles.errorText}>{errors.slot_date.message}</Text>}

            {/* Time Slot Selection */}
            <Text style={styles.label}>Select Time Slot</Text>
             <TimeSlotSelector
                hideTitle={true}
                date={selectedDate} // Pass the selected date if needed for slot filtering
                bestTime={''} // You might want to remove this prop if not used
                setTimeSlot={setSelectedSlotId}
                time={selectedSlotTime} // Pass the watched slot_time
                isUserView={true}
            />
            {errors.slot_time && <Text style={styles.errorText}>{errors.slot_time.message || 'Time slot is required.'}</Text>}


            <AddressSelector
                savedAddresses={savedUserAddresses}
                onAddressSelect={handleAddressSelect}
                selectedAddressId={selectedAddress?.id || null}
            />


            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={handlePreviousStep}
                >
                    <FontAwesome name="arrow-left" size={16} color="#fff" style={{ marginRight: 10 }} />
                    <Text style={styles.buttonText}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.postButton, isNextButtonDisabled && styles.buttonDisabled]}
                    disabled={isNextButtonDisabled}
                    onPress={onSubmit} // Call the passed onSubmit (which is handleSubmit(onSubmit))
                >
                    <Text style={styles.buttonText}>Post Job</Text>
                    <FontAwesome name="check" size={16} color="#fff" style={{ marginLeft: 10 }} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Step2;