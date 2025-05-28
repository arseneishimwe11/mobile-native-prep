import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { saveBooking } from '../utils/storage';
import ApiService from '../services/apiService';

const BookBusScreen = ({ route, navigation }) => {
  const { bus } = route.params;
  const [formData, setFormData] = useState({
    passengerName: '',
    phoneNumber: '',
    numberOfSeats: '1',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.passengerName.trim()) {
      newErrors.passengerName = 'Name is required';
    } else if (formData.passengerName.trim().length < 2) {
      newErrors.passengerName = 'Name must be at least 2 characters';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10,}$/.test(formData.phoneNumber.replace(/[^\d]/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    const seats = parseInt(formData.numberOfSeats);
    if (!seats || seats < 1) {
      newErrors.numberOfSeats = 'Number of seats must be at least 1';
    } else if (seats > bus.availableSeats) {
      newErrors.numberOfSeats = `Only ${bus.availableSeats} seats available`;
    } else if (seats > 5) {
      newErrors.numberOfSeats = 'Maximum 5 seats per booking';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBooking = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const bookingData = {
        busId: bus.id,
        busName: bus.name,
        route: bus.route,
        departureTime: bus.departureTime,
        arrivalTime: bus.arrivalTime,
        price: bus.price,
        passengerName: formData.passengerName,
        phoneNumber: formData.phoneNumber,
        numberOfSeats: parseInt(formData.numberOfSeats),
        totalPrice: bus.price * parseInt(formData.numberOfSeats),
      };

      // Use API instead of local storage
      const booking = await ApiService.createBooking(bookingData);
      
      Alert.alert(
        'Booking Confirmed!',
        `Your booking for ${formData.numberOfSeats} seat(s) on ${bus.name} has been confirmed.`,
        [
          {
            text: 'View Bookings',
            onPress: () => navigation.navigate('MyBookings'),
          },
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const calculateTotalPrice = () => {
    const seats = parseInt(formData.numberOfSeats) || 0;
    return bus.price * seats;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Bus Information Header */}
        <View style={styles.busInfoContainer}>
          <Text style={styles.busName}>{bus.name}</Text>
          <Text style={styles.busRoute}>{bus.route}</Text>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>Departure: {bus.departureTime}</Text>
            <Text style={styles.timeText}>Arrival: {bus.arrivalTime}</Text>
          </View>
          <Text style={styles.priceText}>Price per seat: ${bus.price}</Text>
          <Text style={styles.availableSeats}>
            Available Seats: {bus.availableSeats}
          </Text>
        </View>

        {/* Booking Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Booking Details</Text>
          
          {/* Passenger Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Passenger Name *</Text>
            <TextInput
              style={[styles.input, errors.passengerName && styles.inputError]}
              value={formData.passengerName}
              onChangeText={(value) => updateFormData('passengerName', value)}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
            />
            {errors.passengerName && (
              <Text style={styles.errorText}>{errors.passengerName}</Text>
            )}
          </View>

          {/* Phone Number */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={[styles.input, errors.phoneNumber && styles.inputError]}
              value={formData.phoneNumber}
              onChangeText={(value) => updateFormData('phoneNumber', value)}
              placeholder="Enter your phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
            {errors.phoneNumber && (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            )}
          </View>

          {/* Number of Seats */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Number of Seats *</Text>
            <TextInput
              style={[styles.input, errors.numberOfSeats && styles.inputError]}
              value={formData.numberOfSeats}
              onChangeText={(value) => updateFormData('numberOfSeats', value)}
              placeholder="1"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
            {errors.numberOfSeats && (
              <Text style={styles.errorText}>{errors.numberOfSeats}</Text>
            )}
          </View>

          {/* Total Price Display */}
          <View style={styles.totalPriceContainer}>
            <Text style={styles.totalPriceLabel}>Total Price:</Text>
            <Text style={styles.totalPriceValue}>${calculateTotalPrice()}</Text>
          </View>

          {/* Book Button */}
          <TouchableOpacity
            style={[styles.bookButton, isLoading && styles.bookButtonDisabled]}
            onPress={handleBooking}
            disabled={isLoading}
          >
            <Text style={styles.bookButtonText}>
              {isLoading ? 'Booking...' : 'Confirm Booking'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  busInfoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  busName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  busRoute: {
    fontSize: 18,
    color: '#34495e',
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timeText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#27ae60',
    marginBottom: 8,
  },
  availableSeats: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 4,
  },
  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  totalPriceLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  totalPriceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  bookButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonDisabled: {
    backgroundColor: '#95a5a6',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BookBusScreen;