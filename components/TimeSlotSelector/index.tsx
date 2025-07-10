import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'; // Removed FlatList

// Get screen width for dynamic button sizing
const screenWidth = Dimensions.get('window').width;

interface TimeSlot {
    id: string;
    startTime: string; // e.g., "10:00"
    endTime: string;   // e.g., "12:00"
    label: string;   
    bestTime: boolean;  // e.g., "10 AM - 12 PM"
}

// Helper function to generate time slots (remains the same)
const generateTimeSlots = (time: any): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    let idCounter = 0;

    // Start from 10 AM
    let currentHour = 10;
    const endHour = 22; // End at 10 PM (22:00 in 24-hour format)

    while (currentHour < endHour) {
        const startPeriod = currentHour < 12 ? 'AM' : 'PM';
        const displayStartHour = currentHour > 12 ? currentHour - 12 : currentHour;
        const formattedStartTime = `${displayStartHour}:00 ${startPeriod}`;

        const nextHour = currentHour + 2;
        const endPeriod = nextHour < 12 ? 'AM' : 'PM';
        const displayEndHour = nextHour > 12 ? nextHour - 12 : nextHour;
        const formattedEndTime = `${displayEndHour}:00 ${endPeriod}`;
        const bestTime = `${formattedStartTime} - ${formattedEndTime}` === time



        slots.push({
            id: String(idCounter++),
            startTime: `${String(currentHour).padStart(2, '0')}:00`,
            endTime: `${String(nextHour).padStart(2, '0')}:00`,
            label: `${formattedStartTime} - ${formattedEndTime}`,
            bestTime: bestTime
        });

        currentHour = nextHour;
    }

    return slots;
};



const TimeSlotSelector = ({date, time, bestTime, setTimeSlot}: any) => {
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

    const timeSlots = generateTimeSlots(bestTime);

    const handleSlotPress = (slotId: string, slotLabel: string) => {
        setSelectedSlotId(slotId);
        setTimeSlot(slotLabel)
        console.log(`Selected slot: ${slotLabel} (ID: ${slotId})`);
        // You can pass the selected slot data up to a parent component here
        // e.g., if you have a prop like onSelectSlot(slotId, slotLabel);
    };


    useEffect(() => {
        if (time) {
            const initialSlot = timeSlots.find(slot => slot.label === time);

            if (initialSlot && selectedSlotId === null) {
                setSelectedSlotId(initialSlot.id);
            }
        }
    }, [time, timeSlots, selectedSlotId]);


    // Group slots into pairs for 2x2 grid layout
    const rows = [];
    for (let i = 0; i < timeSlots.length; i += 2) {
        rows.push(timeSlots.slice(i, i + 2));
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select a Time Slot: for <Text style={styles.dateTitle}>{dayjs(date).format('DD MMM YYYY')}</Text> </Text>
            <Text style={styles.noteText}>"Note: The dashed border indicates the best time to pick."</Text>
            <View style={styles.gridContainer}>
                {rows.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.gridRow}>
                        {row.map((item) => (
                            <TouchableOpacity
                                key={item.id} // Unique key for each button
                                style={[
                                    styles.slotButton,
                                    selectedSlotId === item.id && styles.selectedSlotButton,
                                    item.bestTime && styles.bestTimeSlotButton,
                                ]}
                                onPress={() => handleSlotPress(item.id, item.label)}
                            >
                                {/* {item.bestTime && <Text
                                    style={
                                        styles.bestTimeText
                                    }
                                >
                                    (good)
                                </Text>} */}
                                <Text
                                    style={[
                                        styles.slotText,
                                        selectedSlotId === item.id && styles.selectedSlotText,
                                    ]}
                                >
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>
            {selectedSlotId && (
                <Text style={styles.selectionInfo}>
                    You selected: {timeSlots.find(slot => slot.id === selectedSlotId)?.label}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 15,
        backgroundColor: '#f9f9f9',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    dateTitle: {
        color: 'green'
    },
    noteText: {
        fontSize: 12,
        color: 'orange',
        marginLeft: 15, // Keep consistent with previous spacing
        marginBottom: 5

    },
    bestTimeText: {
        fontSize: 9,
        color: 'green'
    },
    bestTimeSlotButton: {
        borderWidth: 2,         // Set border width to 2 pixels
        borderStyle: 'dashed',  // Make the border dashed
        borderColor: 'orange',  // Set the border color to orange

    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 15, // Keep consistent with previous spacing
        color: '#333',
    },
    gridContainer: {
        paddingHorizontal: 10, // Overall padding for the grid
    },
    gridRow: {
        flexDirection: 'row', // Arranges items horizontally in each row
        justifyContent: 'space-around', // Distributes items evenly with space around them
        marginBottom: 10, // Space between rows
    },
    // Calculate button width to fit two per row with some margin
    // (screenWidth - (paddingHorizontal * 2) - (marginHorizontal * 2 per button)) / 2
    // Assuming paddingHorizontal 10 * 2 = 20, marginHorizontal 5 * 2 buttons = 10 (total 30px taken by padding/margins)
    slotButton: {
        width: (screenWidth - 70) / 2, // Distribute width for two buttons with spacing
        backgroundColor: '#e0e0e0',
        paddingVertical: 10, // Increased padding for a slightly larger button feel
        paddingHorizontal: 5,
        borderRadius: 10, // Slightly less rounded than the pill shape, more like a standard button
        borderWidth: 1,
        borderColor: '#d0d0d0',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5, // Space between buttons in the same row
    },
    selectedSlotButton: {
        backgroundColor: '#007bff', // Blue background for selected
        borderColor: '#0056b3',
    },
    slotText: {
        fontSize: 13, // Keep font size small for "tiny" look
        color: '#333',
        fontWeight: '500',
        textAlign: 'center', // Ensure text is centered within the button
    },
    selectedSlotText: {
        color: '#ffffff', // White text for selected
        fontWeight: 'bold',
    },
    selectionInfo: {
        marginTop: 15,
        marginLeft: 15,
        fontSize: 14,
        color: '#555',
    }
});

export default TimeSlotSelector;