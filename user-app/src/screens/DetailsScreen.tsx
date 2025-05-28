import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import Header from '../components/Header';
import Button from '../components/Button';
import colors from '../styles/colors';
import typography from '../styles/typography';
import spacing from '../styles/spacing';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;
type DetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Details'>;

const DetailsScreen: React.FC = () => {
  const route = useRoute<DetailsScreenRouteProp>();
  const navigation = useNavigation<DetailsScreenNavigationProp>();
  const { bus } = route.params;

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleBookPress = () => {
    navigation.navigate('BookBus', { bus });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header 
        title={bus.name} 
        showBackButton 
        onBackPress={handleBackPress} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: bus.image }} style={styles.image} />
        
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.busName}>{bus.name}</Text>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>${bus.price.toFixed(2)}</Text>
            </View>
          </View>
          
          <View style={styles.routeContainer}>
            <Ionicons name="location" size={20} color={colors.primary} />
            <Text style={styles.routeText}>{bus.route}</Text>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={20} color={colors.primary} />
                <View>
                  <Text style={styles.infoLabel}>Departure</Text>
                  <Text style={styles.infoValue}>{bus.departureTime}</Text>
                </View>
              </View>
              
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={20} color={colors.secondary} />
                <View>
                  <Text style={styles.infoLabel}>Arrival</Text>
                  <Text style={styles.infoValue}>{bus.arrivalTime}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="people-outline" size={20} color={colors.primary} />
                <View>
                  <Text style={styles.infoLabel}>Available Seats</Text>
                  <Text style={styles.infoValue}>{bus.availableSeats} / {bus.totalSeats}</Text>
                </View>
              </View>
              
              <View style={styles.infoItem}>
                <Ionicons name="cash-outline" size={20} color={colors.success} />
                <View>
                  <Text style={styles.infoLabel}>Price per Seat</Text>
                  <Text style={styles.infoValue}>${bus.price.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.featuresContainer}>
            <Text style={styles.sectionTitle}>Features</Text>
            
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="wifi" size={20} color={colors.primary} />
                <Text style={styles.featureText}>Free WiFi</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Ionicons name="snow-outline" size={20} color={colors.primary} />
                <Text style={styles.featureText}>Air Conditioning</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Ionicons name="battery-charging-outline" size={20} color={colors.primary} />
                <Text style={styles.featureText}>USB Charging</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Ionicons name="cafe-outline" size={20} color={colors.primary} />
                <Text style={styles.featureText}>Refreshments</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.policiesContainer}>
            <Text style={styles.sectionTitle}>Policies</Text>
            
            <View style={styles.policyItem}>
              <Ionicons name="information-circle-outline" size={20} color={colors.textLight} />
              <Text style={styles.policyText}>
                Arrive at least 15 minutes before departure time.
              </Text>
            </View>
            
            <View style={styles.policyItem}>
              <Ionicons name="information-circle-outline" size={20} color={colors.textLight} />
              <Text style={styles.policyText}>
                Cancellation available up to 2 hours before departure.
              </Text>
            </View>
            
            <View style={styles.policyItem}>
              <Ionicons name="information-circle-outline" size={20} color={colors.textLight} />
              <Text style={styles.policyText}>
                Each passenger is allowed one piece of luggage.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.seatsInfo}>
          <Text style={styles.seatsLabel}>Available Seats</Text>
          <Text style={styles.seatsValue}>{bus.availableSeats}</Text>
        </View>
        
        <Button 
          title="Book Now" 
          onPress={handleBookPress} 
          style={styles.bookButton}
          disabled={bus.availableSeats === 0}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  busName: {
    ...typography.title,
    flex: 1,
    marginRight: spacing.sm,
  },
  priceTag: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  priceText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  routeText: {
    ...typography.body,
    marginLeft: spacing.sm,
    flex: 1,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    ...typography.caption,
    marginLeft: spacing.sm,
  },
  infoValue: {
    ...typography.body,
    fontWeight: '600',
    marginLeft: spacing.sm,
    marginBottom: 0,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  sectionTitle: {
    ...typography.subtitle,
    marginBottom: spacing.sm,
  },
  featuresContainer: {
    marginBottom: spacing.lg,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: spacing.sm,
  },
  featureText: {
    ...typography.body,
    marginLeft: spacing.sm,
    marginBottom: 0,
  },
  policiesContainer: {
    marginBottom: spacing.xl,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  policyText: {
    ...typography.body,
    marginLeft: spacing.sm,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  seatsInfo: {
    marginRight: spacing.md,
  },
  seatsLabel: {
    ...typography.caption,
  },
  seatsValue: {
    ...typography.subtitle,
    color: colors.primary,
    marginBottom: 0,
  },
  bookButton: {
    flex: 1,
  },
});

export default DetailsScreen;