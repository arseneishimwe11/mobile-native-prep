import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import Header from '../components/Header';
import Button from '../components/Button';
import { validateName, validatePhone, validateSeats } from '../utils/validation';
import { useBookings } from '../context/BookingContext';
import colors from '../styles/colors';
import typography from '../styles/typography';
import spacing from '../styles/spacing';

type BookBusScreenRouteProp = RouteProp<RootStackParamList, 'BookBus'>;
type BookBusScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BookBus'>;

const BookBusScreen: React.FC = () => {
  const route = useRoute<BookBusScreenRouteProp>();
  const navigation = useNavigation<BookBusScreenNavigationProp>();
  const { bus } = route.params;
  const { addBooking } = useBookings();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [seats, setSeats] = useState('1');
  const [loading, setLoading] = useState(false);
  
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [seatsError, setSeatsError] = useState<string | null>(null);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const validateForm = (): boolean => {
    const nameValidation = validateName(name);
    const phoneValidation = validatePhone(phone);
    const seatsValidation = validateSeats(seats, bus.availableSeats);
    
    setNameError(nameValidation);
    setPhoneError(phoneValidation);
    setSeatsError(seatsValidation);
    
    return !nameValidation && !phoneValidation && !seatsValidation;
  };

  const handleBooking = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      const seatsNum = parseInt(seats, 10);
      const totalPrice = seatsNum * bus.price;
      
      await addBooking({
        busId: bus.id,
        busName: bus.name,
        route: bus.route,
        departureTime: bus.departureTime,
        passengerName: name,
        phoneNumber: phone,
        seats: seatsNum,
        totalPrice,
      });
      
      Alert.alert(
        'Booking Successful',
        'Your bus ticket has been booked successfully!',
        [
          { 
            text: 'View My Bookings', 
            onPress: () => navigation.navigate('MyBookings') 
          },
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('Home') 
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to book the ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header 
        title="Book Bus Ticket" 
        showBackButton 
        onBackPress={handleBackPress} 
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.busInfoCard}>
              <Text style={styles.busName}>{bus.name}</Text>
              <Text style={styles.busRoute}>{bus.route}</Text>
              
              <View style={styles.busDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Departure</Text>
                  <Text style={styles.detailValue}>{bus.departureTime}</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Available Seats</Text>
                  <Text style={styles.detailValue}>{bus.availableSeats}</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Price per Seat</Text>
                  <Text style={styles.detailValue}>${bus.price.toFixed(2)}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Passenger Information</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={[styles.input, nameError && styles.inputError]}
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    setNameError(null);
                  }}
                />
                {nameError && <Text style={styles.errorText}>{nameError}</Text>}
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={[styles.input, phoneError && styles.inputError]}
                  placeholder="Enter your phone number"
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    setPhoneError(null);
                  }}
                  keyboardType="phone-pad"
                />
                {phoneError && <Text style={styles.errorText}>{phoneError}</Text>}
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Number of Seats</Text>
                <TextInput
                  style={[styles.input, seatsError && styles.inputError]}
                  placeholder="Enter number of seats"
                  value={seats}
                  onChangeText={(text) => {
                    setSeats(text);
                    setSeatsError(null);
                  }}
                  keyboardType="number-pad"
                />
                {seatsError && <Text style={styles.errorText}>{seatsError}</Text>}
              </View>
            </View>
            
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Booking Summary</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Bus</Text>
                <Text style={styles.summaryValue}>{bus.name}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Route</Text>
                <Text style={styles.summaryValue}>{bus.route}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Departure</Text>
                <Text style={styles.summaryValue}>{bus.departureTime}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Seats</Text>
                <Text style={styles.summaryValue}>{seats || '0'}</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Price</Text>
                <Text style={styles.totalValue}>
                  ${((parseInt(seats, 10) || 0) * bus.price).toFixed(2)}
                </Text>
              </View>
            </View>
            
            <Button
              title="Confirm Booking"
              onPress={handleBooking}
              loading={loading}
              fullWidth
              style={styles.bookButton}
            />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  busInfoCard: {
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
  busName: {
    ...typography.subtitle,
  },
  busRoute: {
    ...typography.body,
    color: colors.textLight,
  },
  busDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    ...typography.caption,
    color: colors.textLight,
  },
  detailValue: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: 0,
  },
  formContainer: {
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
  formTitle: {
    ...typography.subtitle,
    marginBottom: spacing.md,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    ...typography.body,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  summaryContainer: {
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
  summaryTitle: {
    ...typography.subtitle,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.textLight,
    marginBottom: 0,
  },
  summaryValue: {
    ...typography.body,
    fontWeight: '500',
    marginBottom: 0,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    ...typography.subtitle,
    marginBottom: 0,
  },
  totalValue: {
    ...typography.title,
    color: colors.primary,
    marginBottom: 0,
  },
  bookButton: {
    marginTop: spacing.md,
  },
});

export default BookBusScreen;