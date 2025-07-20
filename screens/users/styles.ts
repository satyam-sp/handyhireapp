import { Dimensions, StyleSheet } from "react-native";
const { width } = Dimensions.get('window');

const Colors = {
    background: '#F8F9FA', // Very light gray / Off-white
    cardBackground: '#FFFFFF',
    cardBackgroundGray: '#rgb(0, 128, 128, 0.3)',

    textPrimary: '#343A40', // Dark charcoal
    textSecondary: '#07130d', // Muted gray
    accentBlue: '#075e54', // Standard professional blue
    accentBlueDark: '#0056B3', // Darker blue for gradients
    accentGreen: '#28A745', // Standard success green
    accentGreenLight: '#D4EDDA', // Very light green for backgrounds
    accentOrange: '#FD7E14', // Standard warning orange (for coupon gradient start)
    accentYellow: '#FFC107', // Standard warning yellow (for coupon gradient end)
    accentGold: '#FFD700', // For stars
    shadowLight: 'rgba(0, 0, 0, 0.08)',

    shadowMedium: 'rgba(0, 0, 0, 0.15)',
};
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background, // Light gray background
    },
    scrollViewContent: {
        padding: 20,
        paddingBottom: 40, // Extra padding at bottom
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
        paddingTop: 10,
    },
    greetingText: {
        fontSize: 18,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    welcomeText: {
        fontSize: 24,
        color: Colors.textPrimary,
        fontWeight: 'bold',
        marginTop: 4,
    },
    notificationButton: {
        backgroundColor: Colors.cardBackground,
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.shadowLight,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 15,
        marginTop: 25, // More space between sections
    },
    // --- Active Job Card ---


    // --- Active Job Card (Individual Card Style) ---
    activeJobCard: {
        borderRadius: 15,
        padding: 20,
        width: width * 0.9, // Each card takes 80% of screen width
        marginRight: 15, // Spacing between cards
        shadowColor: Colors.shadowMedium,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 12,
    },
    activeJobTitle: {
        fontSize: 20, // Slightly smaller for multiple cards
        fontWeight: 'bold',
        color: Colors.accentBlue,
        flex: 1, // Allows text to take available space and wrap
    },
    activeJobDescription: {
        fontSize: 14, // Slightly smaller for multiple cards
        color: 'rgba(69, 117, 115, 0.9)', // Slightly transparent white for descriptions
        lineHeight: 20,
        marginBottom: 15,
        // Add flexWrap to description to ensure it wraps within the given width
        flexWrap: 'wrap',
    },
    activeJobHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    activeJobIcon: {
        marginRight: 10,
    },

    activeJobButton: {
        flexDirection: 'row',
        backgroundColor: Colors.accentBlue,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignSelf: 'flex-start',
        alignItems: 'center',
    },
    activeJobButtonText: {
        color: Colors.cardBackground,
        fontWeight: 'bold',
        fontSize: 15,
    },

    // --- Coupon Card ---
    couponCard: {
        borderRadius: 15,
        marginBottom: 20,
        shadowColor: Colors.shadowMedium,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.9,
        shadowRadius: 8,
        elevation: 10,
        overflow: 'hidden', // Ensure image respects border radius
    },
    couponContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    couponTextContainer: {
        flex: 1, // Allow text to take most space
        marginRight: 10,
    },
    couponHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    couponTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: Colors.cardBackground,
        marginLeft: 10,
    },
    couponCode: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.cardBackground, // White color for code on gradient
        marginBottom: 5,
        letterSpacing: 1,
    },
    couponDescription: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 10,
    },
    couponExpiry: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 15,
    },
    couponButton: {
        backgroundColor: Colors.cardBackground,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    couponButtonText: {
        color: Colors.accentBlue, // Text matches gradient start color
        fontWeight: 'bold',
        fontSize: 15,
    },
    couponImage: {
        width: 100, // Fixed width for image
        height: 100, // Fixed height for image
        borderRadius: 10, // Slightly rounded image corners
        backgroundColor: 'rgba(255,255,255,0.2)', // Placeholder background
    },

    // --- Quick Actions ---
    quickActionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        marginBottom: 30,
        backgroundColor: Colors.cardBackground,
        borderRadius: 15,
        paddingVertical: 15,
        shadowColor: Colors.shadowLight,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    quickActionButton: {
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    quickActionIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(0, 123, 255, 0.1)', // Light accent blue background for icons
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    quickActionTitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '600',
        textAlign: 'center',
    },

    // --- Professionals ---
    professionalsContainer: {
        paddingVertical: 10,
    },
    professionalCard: {
        backgroundColor: Colors.cardBackground,
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        marginRight: 15,
        width: 150, // Fixed width for professional cards
        shadowColor: Colors.shadowLight,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    professionalImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: Colors.accentBlue, // Accent border for profile pictures
    },
    professionalPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EAEAEA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 2,
        borderColor: Colors.textSecondary,
    },
    professionalName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 5,
        textAlign: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 215, 0, 0.2)', // Light yellow background for rating
        borderRadius: 5,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    ratingText: {
        fontSize: 13,
        color: Colors.textPrimary,
        marginLeft: 5,
        fontWeight: '600',
    },


    activeJobCardSkeleton: {
        width: width * 0.9, // Match the actual card width
        height: 200, // Approximate height of your active job card
        borderRadius: 15,
        // REMOVED: backgroundColor, borderBlockColor, borderColor, shadow properties
        // These are handled by SkeletonPlaceholder's own props and rendering
        padding: 20, // Match actual card padding
        marginRight: 15, // Match actual card margin
    },

    activeJobCardWrapper: {
        // This width matches activeJobCardWidth (width * 0.9)
        // The margin is applied here to create spacing between skeleton cards
        width: width * 0.895,
        marginRight: 15,
        borderRadius: 15, // Apply border radius here
        // Shadow properties
        shadowColor: Colors.accentBlue, // Using accentBlue for shadow as requested
        shadowOffset: { width: 0, height: 8 }, // Adjust height for more vertical shadow
        shadowOpacity: 0.4, // Make it more visible
        shadowRadius: 10,
        elevation: 12, // For Android shadow
        backgroundColor: '#FFFFFF', // A background color for the wrapper to make shadow visible
        borderColor: '#ccc', // Border color
        borderWidth: 1, // Border width
        overflow: 'hidden', // Ensures skeleton doesn't overflow rounded corners
    },


 


    errorContainer: {
        flex: 1, // Allows it to take up available space
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
        padding: 20, // Add some padding around the content
        backgroundColor: 'white', // Match your screen background or a subtle error background
        // You might want to add a minimum height if it's within a scrollable area
        minHeight: 150, // Example: ensure it's visible even with little content
    },
    errorText: {
        fontSize: 16,
        color: Colors.accentBlue, // A dark, readable color for text on a light background
        textAlign: 'center', // Center align the text
        marginBottom: 10, // Space below the text before the button
    },
    retryButtonText: {
        fontSize: 16,
        color: Colors.accentBlue, // Use an accent color to make it clickable
        fontWeight: 'bold', // Make it stand out
        textDecorationLine: 'underline', // Optionally add an underline to indicate clickable
    },

});

export { styles, Colors }