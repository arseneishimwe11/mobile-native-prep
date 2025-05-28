import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const DetailsScreen = ({ route, navigation }) => {
  const { bus } = route.params;

  const handleBookNow = () => {
    navigation.navigate('BookBus', { bus });
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: bus.image }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.busName}>{bus.name}</Text>
        <Text style={styles.route}>{bus.route}</Text>
        
        <View style={styles.timeSection}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          <View style={styles.timeRow}>
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>Departure</Text>
              <Text style={styles.timeValue}>{bus.departureTime}</Text>
            </View>
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>Arrival</Text>
              <Text style={styles.timeValue}>{bus.arrivalTime}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.seatsSection}>
          <Text style={styles.sectionTitle}>Seat Availability</Text>
          <View style={styles.seatsRow}>
            <View style={styles.seatInfo}>
              <Text style={styles.seatNumber}>{bus.availableSeats}</Text>
              <Text style={styles.seatLabel}>Available</Text>
            </View>
            <View style={styles.seatInfo}>
              <Text style={styles.seatNumber}>{bus.totalSeats}</Text>
              <Text style={styles.seatLabel}>Total</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.amenitiesSection}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesList}>
            {bus.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityItem}>
                <Text style={styles.amenityText}>• {amenity}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Price per seat</Text>
          <Text style={styles.price}>${bus.price}</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.bookButton,
            bus.availableSeats === 0 && styles.bookButtonDisabled
          ]}
          onPress={handleBookNow}
          disabled={bus.availableSeats === 0}
        >
          <Text style={styles.bookButtonText}>
            {bus.availableSeats === 0 ? 'Fully Booked' : 'Book Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  busName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E86AB',
    marginBottom: 8,
  },
  route: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  timeSection: {
    marginBottom: 24,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  timeItem: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    flex: 0.45,
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seatsSection: {
    marginBottom: 24,
  },
  seatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  seatInfo: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    flex: 0.45,
  },
  seatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E86AB',
    marginBottom: 4,
  },
  seatLabel: {
    fontSize: 14,
    color: '#666',
  },
  amenitiesSection: {
    marginBottom: 24,
  },
  amenitiesList: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  amenityItem: {
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 16,
    color: '#333',
  },
  priceSection: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F18F01',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  bookButton: {
    backgroundColor: '#2E86AB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonDisabled: {
    backgroundColor: '#ccc',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DetailsScreen;