import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  SafeAreaView, 
  Text,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import Header from '../components/Header';
import BookingCard from '../components/BookingCard';
import Button from '../components/Button';
import LoadingIndicator from '../components/LoadingIndicator';
import { useBookings } from '../context/BookingContext';
import colors from '../styles/colors';
import typography from '../styles/typography';
import spacing from '../styles/spacing';

type MyBookingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MyBookings'>;

const MyBookingsScreen: React.FC = () => {
  const navigation = useNavigation<MyBookingsScreenNavigationProp>();
  const { bookings, loading, deleteBooking, refreshBookings } = useBookings();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      await deleteBooking(id);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete booking. Please try again.');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshBookings();
    setIsRefreshing(false);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Bookings Yet</Text>
      <Text style={styles.emptyText}>
        You haven't made any bus bookings yet. Start by exploring available buses.
      </Text>
      <Button 
        title="Browse Buses" 
        onPress={() => navigation.navigate('Home')}
        style={styles.browseButton}
      />
    </View>
  );

  if (loading && !isRefreshing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="My Bookings" showBackButton onBackPress={handleBackPress} />
        <LoadingIndicator message="Loading your bookings..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="My Bookings" showBackButton onBackPress={handleBackPress} />
      
      <View style={styles.container}>
        {bookings.length > 0 ? (
          <FlatList
            data={bookings}
            renderItem={({ item }) => (
              <BookingCard 
                booking={item} 
                onDelete={handleDeleteBooking} 
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            onRefresh={handleRefresh}
            refreshing={isRefreshing}
          />
        ) : (
          renderEmptyState()
        )}
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
    padding: spacing.md,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    ...typography.title,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textLight,
    marginBottom: spacing.xl,
  },
  browseButton: {
    width: '80%',
  },
});

export default MyBookingsScreen;