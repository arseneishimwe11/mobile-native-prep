import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

const BusCard = ({ bus, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: bus.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.busName}>{bus.name}</Text>
        <Text style={styles.route}>{bus.route}</Text>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{bus.departureTime} → {bus.arrivalTime}</Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.seats}>
            {bus.availableSeats}/{bus.totalSeats} seats
          </Text>
          <Text style={styles.price}>${bus.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  busName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E86AB',
    marginBottom: 4,
  },
  route: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  timeContainer: {
    marginBottom: 12,
  },
  time: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seats: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F18F01',
  },
});

export default BusCard;