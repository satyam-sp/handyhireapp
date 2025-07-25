import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native'; // Import ViewStyle and TextStyle for type safety

// Define props interface for better type checking (optional but recommended)
interface SoftButtonProps {
    title: string;
    onPress: () => void;
    color?: 'blue' | 'red' | 'green' | 'grey' | 'orange'; // Define accepted colors
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle | ViewStyle[]; // Allow single style object or array of style objects
    textStyle?: TextStyle | TextStyle[]; // Optional: if you want to pass custom text styles
}

const SoftButton: React.FC<SoftButtonProps> = ({
    title,
    onPress,
    color = 'blue', // Default color
    disabled = false,
    loading = false,
    style, // Receive the style prop
    textStyle // Receive optional text style prop
}) => {
    const colorMap = {
        blue: '#007bff',
        red: '#dc3545',
        green: '#28a745',
        grey: '#6c757d',
        orange: '#ff8833',
    };

    const textColorMap = {
        blue: '#ffffff',
        red: '#ffffff',
        green: '#ffffff',
        grey: '#ffffff',
        orange: '#ffffff',
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.button, // Base button styles
                { backgroundColor: colorMap[color] }, // Color based on prop
                (disabled || loading) && styles.disabled, // Disabled styles
                style, // THIS IS THE CORRECT WAY to pass external styles
            ]}
        >
            {loading ? (
                <ActivityIndicator color={textColorMap[color]} />
            ) : (
                <Text style={[styles.text, { color: textColorMap[color] }, textStyle]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
  
        justifyContent: 'center',
        minWidth: 100, // Ensure a minimum width for consistent look
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginVertical: 6,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabled: {
        opacity: 0.6, // Visual feedback for disabled state
    },
});

export default SoftButton;



