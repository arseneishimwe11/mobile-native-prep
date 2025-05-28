import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

const BookingCard = ({ booking, onDelete }) => {
  const handleDelete = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => onDelete(booking.id) },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.busName}>{booking.busName}</Text>
        <Text style={styles.bookingId}>#{booking.id}</Text>
      </View>
      
      <Text style={styles.route}>{booking.route}</Text>
      <Text style={styles.time}>{booking.departureTime} → {booking.arrivalTime}</Text>
      
      <View style={styles.detailsRow}>
        <Text style={styles.passenger}>Passenger: {booking.passengerName}</Text>
        <Text style={styles.seats}>Seats: {booking.numberOfSeats}</Text>
      </View>
      
      <View style={styles.detailsRow}>
        <Text style={styles.phone}>Phone: {booking.phoneNumber}</Text>
        <Text style={styles.total}>Total: ${(booking.price * booking.numberOfSeats).toFixed(2)}</Text>
      </View>
      
      <Text style={styles.bookingDate}>Booked: {formatDate(booking.bookingDate)}</Text>
      
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Cancel Booking</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  busName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E86AB',
  },
  bookingId: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  route: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  time: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  passenger: {
    fontSize: 14,
    color: '#333',
  },
  seats: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  phone: {
    fontSize: 14,
    color: '#666',
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F18F01',
  },
  bookingDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default BookingCard;