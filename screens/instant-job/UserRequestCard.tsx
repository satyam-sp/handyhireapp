// src/components/UserRequestCard.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconEncrypto from 'react-native-vector-icons/Entypo';

import FraudSvg from '../../assets/svgs/fraudprotectunprotectedminor-svgrepo-com.svg'
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface UserRequestCardProps {
    user: any;
    application: any;
    onAcceptRevoke: (applicationId: string, status: number) => void;
    onDecline: (userId: string) => void;
    onViewProfile: (userId: string) => void;
    applicationId: any;
  
    loading1: boolean;
    isToggled: boolean;
    onToggleCard: (applicationId: string) => void;
    isRecommended?: boolean; // NEW PROP: to control visibility of the "Recommended" badge
}

const UserRequestCard: React.FC<UserRequestCardProps> = ({
    isToggled,
    onToggleCard,
    loading1,
    application,
    user,
    applicationId,
    onAcceptRevoke,
    onDecline,
    onViewProfile,
    isRecommended = false // Default to false if not provided
}) => {

    const { status, final_price: finalPrice, slot_time: slotTime} = application

    const handlePressCard = () => {
        onToggleCard(applicationId);
    };

    const renderRatingStars = (rating = 0) => {
        const totalStars = 5;
        const filledStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = totalStars - filledStars - (hasHalfStar ? 1 : 0);

        return (
            <View style={styles.starsContainer}>
                {[...Array(filledStars)].map((_, i) => (
                    <Icon key={`filled-${i}`} name="star" size={16} color="#FFD700" />
                ))}
                {hasHalfStar && <Icon name="star-half" size={16} color="#FFD700" />}
                {[...Array(emptyStars)].map((_, i) => (
                    <Icon key={`empty-${i}`} name="star-border" size={16} color="#CCCCCC" />
                ))}
                <Text style={styles.ratingText}>({rating})</Text>
            </View>
        );
    };

    const getFraudLevelIndicator = (level = 0) => {
        let iconName: string;
        let color: string;
        let levelText: string = `Lv${level}`;

        switch (level) {
            case 1: // Very Low - Smooth, pleasant Green
                iconName = 'verified-user';
                color = '#66BB6A'; // Material Design Green 400
                break;
            case 2: // Low - Smooth Blue
                iconName = 'info';
                color = '#42A5F5'; // Material Design Blue 400
                break;
            case 3: // Medium - Smooth Amber/Orange
                iconName = 'warning';
                color = '#FFCA28'; // Material Design Amber 400
                break;
            case 4: // High - Smooth, but clear Red
                iconName = 'dangerous';
                color = '#EF5350'; // Material Design Red 400
                break;
            default: // Neutral, soft Grey
                iconName = 'help';
                color = '#888888'; // A common medium-dark grey, often perceived as smooth
                levelText = `Lv${level || 'N/A'}`;
        }
        if(level === 0) {
            return null;
        }
        return (
            <View style={[styles.fruadBadgeContainer, { backgroundColor: color, borderColor: color }]}>
                <FraudSvg width={15} height={15} color={'#FFFFF'} />
                <Text style={[styles.fraudBadgeText]}>{levelText}</Text>
            </View>
        );
    };

    const renderStatusButton = useMemo(() => {
        return status === 'applied' ?
            <TouchableOpacity style={styles.acceptButton} disabled={loading1} onPress={() => onAcceptRevoke(applicationId, 2)}>
                <Text style={styles.buttonText}>{loading1 ? 'Accepting..' : 'Accept'}</Text>
            </TouchableOpacity> : <TouchableOpacity style={[styles.acceptButton, styles.revokeButton]} onPress={() => onAcceptRevoke(applicationId, 1)}>
                <Text style={styles.buttonText}>{loading1 ? 'Revoking..' : 'Revoke'}</Text>
            </TouchableOpacity>
    }, [status, loading1])

    return (
        <TouchableOpacity style={styles.card} onPress={handlePressCard} activeOpacity={0.8}>
            {isRecommended && ( // Conditionally render the "Recommended" badge
                <View style={styles.recommendedBadgeContainer}>
                    <Text style={styles.recommendedBadgeText}>Recommended</Text>
                </View>
            )}
            {getFraudLevelIndicator(user.fraudLevel)}
            <View style={styles.header}>
                <Image source={{ uri: user.avatar_url }} style={styles.profileImage} />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.full_name}</Text>
                    {renderRatingStars(user.rating)}
                    <View style={styles.fraudPriceRow}>
                        <Text style={styles.priceText}>Price: ₹{finalPrice}</Text>
                        <Text style={styles.timeSlot}><IconEncrypto name='time-slot'/>&nbsp;{slotTime}</Text>
                    </View>
                </View>
                <Icon
                    name={isToggled ? 'expand-less' : 'expand-more'}
                    size={30}
                    color="#666"
                    style={styles.toggleIcon}
                />
            </View>

            {isToggled && (
                <View style={styles.actionsContainer}>
                    {renderStatusButton}
                    <TouchableOpacity style={styles.declineButton} onPress={() => onDecline(user.id)}>
                        <Text style={styles.buttonText}>Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.viewProfileLink} onPress={() => onViewProfile(user.id)}>
                        <Text style={styles.viewProfileText}>View Profile</Text>
                    </TouchableOpacity>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        // NEW: Light green border for the card
        borderWidth: 0.5,
        borderColor: '#A5D6A7', // Light green color
    },
    // NEW: Styles for the "Recommended" badge
    recommendedBadgeContainer: {
        position: 'absolute',
        // These values position the badge exactly at the top-right corner.
        // Adjust `right` and `top` if you want it slightly inside or outside.
        right: 0,
        top: -8,
        backgroundColor: '#4CAF50', // White background
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderBottomLeftRadius: 8, // Rounded corner on the bottom-left to fit the card's top-right
        borderTopRightRadius: 10, // Matches the card's top-right corner radius
        borderWidth: 1,
        borderColor: '#A5D6A7', // Same light green border color as the card
        zIndex: 2, // Ensure it's above other card content
    },
    recommendedBadgeText: {
        color: '#FFFF', // Green text for "Recommended"
        fontSize: 12,
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2,
    },
    ratingText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 5,
    },
    fraudIcon: {
        marginRight: 5,
    },
    fraudLevelText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    toggleIcon: {
        marginLeft: 10,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        paddingTop: 15,
    },
    acceptButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
        alignItems: 'center',
    },
    revokeButton: {
        backgroundColor: '#FF9800',
    },
    declineButton: {
        backgroundColor: '#F44336',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        flex: 1,
        marginLeft: 5,
        marginRight: 5,
        alignItems: 'center',
    },
    viewProfileLink: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#2196F3',
        flex: 1,
        marginLeft: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 12,
    },
    viewProfileText: {
        color: '#2196F3',
        fontWeight: 'bold',
        fontSize: 12,
    },
    fraudPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 2,
        width: screenWidth / 1.5,
    },
    fraudLevelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    priceText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#075e54',
    },
    timeSlot: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#909090',
        marginLeft: 10
    },
    fruadBadgeContainer: {
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        // These values position the badge exactly at the top-right corner.
        // Adjust `right` and `top` if you want it slightly inside or outside.
        left: 0,
        top: -8,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderTopLeftRadius: 8, // Rounded corner on the bottom-left to fit the card's top-right
        borderTopRightRadius: 8, // Matches the card's top-right corner radius
        borderBottomRightRadius: 8, // Matches the card's top-right corner radius

        borderWidth: 1,
        borderColor: '#A5D6A7', // Same light green border color as the card
        zIndex: 2, // Ensure it's above other card con
    },

    fraudBadgeText: {
        color: '#FFFF', // Green text for "Recommended"
        fontSize: 12,
        marginLeft: 5,
        fontWeight: 'bold',
    }

});

export default UserRequestCard;