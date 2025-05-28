import * as React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Bus } from '../data/busData';
import colors from '../styles/colors';
import typography from '../styles/typography';
import spacing from '../styles/spacing';

interface BusCardProps {
  bus: Bus;
  onPress: (bus: Bus) => void;
}

const BusCard: React.FC<BusCardProps> = ({ bus, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress(bus)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: bus.image }} style={styles.image} />
      
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.name}>{bus.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${bus.price.toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.routeContainer}>
          <Ionicons name="location" size={16} color={colors.primary} />
          <Text style={styles.route} numberOfLines={1}>{bus.route}</Text>
        </View>
        
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={colors.textLight} />
            <Text style={styles.detailText}>{bus.departureTime}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="people-outline" size={16} color={colors.textLight} />
            <Text style={styles.detailText}>
              {bus.availableSeats} seats left
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View style={[
            styles.statusIndicator, 
            bus.availableSeats < 10 ? styles.lowSeats : styles.availableSeats
          ]} />
          <Text style={styles.statusText}>
            {bus.availableSeats < 10 ? 'Filling fast' : 'Available'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: spacing.md,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    height: 140,
    width: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  name: {
    ...typography.subtitle,
    marginBottom: 0,
    flex: 1,
  },
  priceContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  price: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  route: {
    ...typography.body,
    marginLeft: spacing.xs,
    marginBottom: 0,
    flex: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    ...typography.caption,
    marginLeft: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  availableSeats: {
    backgroundColor: colors.success,
  },
  lowSeats: {
    backgroundColor: colors.warning,
  },
  statusText: {
    ...typography.small,
  },
});

export default BusCard;