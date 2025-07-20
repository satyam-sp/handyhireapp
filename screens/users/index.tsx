import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { styles, Colors } from './styles'
import ActivejobCards from './ActiveJobCards';
const { width } = Dimensions.get('window');

// --- Professional Color Palette ---

// --- Helper Functions ---
const truncateText = (text: string, wordLimit: number) => {
  if (!text) return '';
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};

// --- Reusable Components ---

// Simplified Quick Action Button
interface QuickActionButtonProps {
  title: string;
  iconName: string;
  onPress: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ title, iconName, onPress }) => (
  <TouchableOpacity style={styles.quickActionButton} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.quickActionIconContainer}>
      <FontAwesome name={iconName} size={24} color={Colors.accentBlue} />
    </View>
    <Text style={styles.quickActionTitle}>{title}</Text>
  </TouchableOpacity>
);

// Professional Card (for horizontal scroll)
interface ProfessionalCardProps {
  name: string;
  imageUri?: string;
  rating?: number;
  onPress: () => void;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ name, imageUri, rating, onPress }) => (
  <TouchableOpacity style={styles.professionalCard} onPress={onPress} activeOpacity={0.7}>
    {imageUri ? (
      <Image source={{ uri: imageUri }} style={styles.professionalImage} />
    ) : (
      <View style={styles.professionalPlaceholder}>
        <FontAwesome name="user-circle-o" size={50} color={Colors.textSecondary} />
      </View>
    )}
    <Text style={styles.professionalName} numberOfLines={1}>{name}</Text>
    {rating && (
      <View style={styles.ratingContainer}>
        <FontAwesome name="star" size={14} color={Colors.accentGold} />
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    )}
  </TouchableOpacity>
);

// --- Main HomeScreen Component ---
const HomeScreen: React.FC = () => {
  // Dummy data for Active Job
  const activeJob = {
    title: 'Fix Leaky Faucet in Kitchen',
    description: `The kitchen faucet has been dripping non-stop for the past three days. It's a single-handle mixer faucet. I've tried tightening it, but the leak persists from the base. I need someone experienced in plumbing to fix this urgently. All necessary tools and parts should be brought by the professional. The job needs to be completed by end of day Friday. The water supply can be turned off from the main valve under the sink. Please provide an estimate for the repair.`,
  };

  // Dummy data for Coupon
  const currentCoupon = {
    code: 'SAVEBIG20',
    discount: '20% OFF',
    description: 'On all cleaning services!',
    expiry: 'Expires: 31st Dec 2025',
    image: 'https://img.freepik.com/free-vector/special-offer-discount-banner_18591-68939.jpg?size=626&ext=jpg&ga=GA1.1.2003882772.1721303866&semt=ais_user' // Placeholder for coupon image
  };

  // Dummy data for hired professionals
  const hiredProfessionals = [
    { id: '1', name: 'Alice Smith', image: 'https://randomuser.me/api/portraits/women/1.jpg', rating: 4.8 },
    { id: '2', name: 'Bob Johnson', image: 'https://randomuser.me/api/portraits/men/1.jpg', rating: 4.5 },
    { id: '3', name: 'Charlie Brown', image: 'https://randomuser.me/api/portraits/men/2.jpg', rating: 4.9 },
    { id: '4', name: 'Diana Prince', image: 'https://randomuser.me/api/portraits/women/2.jpg', rating: 4.7 },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>Hello, Satyam!</Text>
            <Text style={styles.welcomeText}>Welcome back to Handy Hire.</Text>
          </View>
          {/* <TouchableOpacity style={styles.notificationButton}>
            <FontAwesome name="bell-o" size={24} color={Colors.textSecondary} />
          </TouchableOpacity> */}
        </View>
        <ActivejobCards />

    


        {/* Coupon Card with Stylish Gradient and Image */}
        <Text style={styles.sectionHeading}>Your Exclusive Coupon</Text>
        <LinearGradient
          colors={[ Colors.accentBlue,Colors.cardBackgroundGray,]} // Warm, professional gradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.couponCard}
        >
          <View style={styles.couponContent}>
            <View style={styles.couponTextContainer}>
              <View style={styles.couponHeader}>
                <FontAwesome name="tag" size={28} color={Colors.cardBackground} />
                <Text style={styles.couponTitle}>{currentCoupon.discount}</Text>
              </View>
              <Text style={styles.couponCode}>{currentCoupon.code}</Text>
              <Text style={styles.couponDescription}>{currentCoupon.description}</Text>
              <Text style={styles.couponExpiry}>{currentCoupon.expiry}</Text>
              <TouchableOpacity style={styles.couponButton}>
                <Text style={styles.couponButtonText}>Apply Now</Text>
              </TouchableOpacity>
            </View>
            {currentCoupon.image && (
              <Image source={{ uri: currentCoupon.image }} style={styles.couponImage} resizeMode="contain" />
            )}
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <Text style={styles.sectionHeading}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <QuickActionButton
            title="My Jobs"
            iconName="list-alt"
            onPress={() => console.log('Go to My Jobs')}
          />
          <QuickActionButton
            title="Coupons"
            iconName="ticket" // More specific coupon icon
            onPress={() => console.log('Go to Coupons')}
          />
          <QuickActionButton
            title="Support"
            iconName="question-circle"
            onPress={() => console.log('Go to Support')}
          />
        </View>

        {/* Professionals you have hired Section */}
        <Text style={styles.sectionHeading}>Professionals you have hired</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.professionalsContainer}>
          {hiredProfessionals.map((pro) => (
            <ProfessionalCard
              key={pro.id}
              name={pro.name}
              imageUri={pro.image}
              rating={pro.rating}
              onPress={() => console.log(`View ${pro.name}'s profile`)}
            />
          ))}
        </ScrollView>

      </ScrollView>
    </SafeAreaView>
  );
};


export default HomeScreen;