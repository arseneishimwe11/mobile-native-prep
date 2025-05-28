import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Booking } from '../context/BookingContext';
import colors from '../styles/colors';
import typography from '../styles/typography';
import spacing from '../styles/spacing';

interface BookingCardProps {
  booking: Booking;
  onDelete: (id: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          style: 'destructive',
          onPress: () => onDelete(booking.id)
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.busName}>{booking.busName}</Text>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="location-outline" size={16} color={colors.primary} />
          <Text style={styles.infoText}>{booking.route}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={16} color={colors.textLight} />
          <Text style={styles.infoText}>{booking.departureTime}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={16} color={colors.textLight} />
          <Text style={styles.infoText}>{formatDate(booking.bookingDate)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.passengerInfo}>
        <View style={styles.infoItem}>
          <Ionicons name="person-outline" size={16} color={colors.textLight} />
          <Text style={styles.infoText}>{booking.passengerName}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="call-outline" size={16} color={colors.textLight} />
          <Text style={styles.infoText}>{booking.phoneNumber}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.infoItem}>
          <Ionicons name="people-outline" size={16} color={colors.textLight} />
          <Text style={styles.infoText}>{booking.seats} seat(s)</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total:</Text>
          <Text style={styles.price}>${booking.totalPrice.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  busName: {
    ...typography.subtitle,
    marginBottom: 0,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    ...typography.body,
    marginLeft: spacing.xs,
    marginBottom: 0,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  passengerInfo: {
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    ...typography.body,
    marginRight: spacing.xs,
    marginBottom: 0,
  },
  price: {
    ...typography.subtitle,
    color: colors.primary,
    marginBottom: 0,
  },
});

export default BookingCard;